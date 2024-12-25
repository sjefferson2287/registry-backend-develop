const axios = require('axios')
const { v4: uuid } = require('uuid')
const ono = require('@jsdevtools/ono')
const validation = require('../validation/validation')
const smsService = require('../../common/services/sendSMS')
const mailService = require('../../common/services/sendMail')
const BaseService = require('../../common/services/base.service')
const auth0Header = require('../../common/helpers/auth0-header.helper')
const auth0 = require('./../../common/services/auth0-connection.service')
const mastodonModels = require('../../../database/mastodonDatabase/models')
const redgistryModels = require('../../../database/redgistryDatabase/models')
const { getMastodonHeaderConfig, updateMastodonUserDetails } = require('../../common/services/mastodon.service')

const { Users, UserRoles, UserSession, profiles, Onboardings, UsersTypes } = redgistryModels

class AuthRepository extends BaseService {
  constructor(model) {
    super(model)
    this.model = model
    this.auth0BaseUrl = process.env.AUTH0_API_BASE_URL
    this.auth0ClientId = process.env.AUTH0_CLIENT_ID
    this.auth0Connection = process.env.AUTH0_CONNECTION
    this.auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET
    this.createUser = this.createUser.bind(this)
    this.loginUser = this.loginUser.bind(this)
    this.getExistingAuth0User = this.getExistingAuth0User.bind(this)
    this.createAuth0User = this.createAuth0User.bind(this)
    this.auth0UserLogin = this.auth0UserLogin.bind(this)
    this.logoutUser = this.logoutUser.bind(this)
  }

  async createUser(createUserDto) {
    try {
      const oauth = await auth0.getAccessToken()
      if (oauth.status < 200 && oauth.status > 299) {
        throw ono({
          status: 400,
          message: 'Invalid client access token',
        })
      }

      if (!createUserDto.is_social) {
        const exisitingAuth0User = await this.getExistingAuth0User(createUserDto.username, oauth)
        if (exisitingAuth0User.status === 200 && exisitingAuth0User.data) {
          throw ono({
            status: 409,
            message: 'User already exists',
          })
        }
      }

      const mastodonUser = await this.createMastodonUser(
        createUserDto.username,
        createUserDto.password || process.env.DEFAULT_MASTO_PASSWORD,
      )
      const mastodonUserData = await this.getMastodonUser(createUserDto.username)

      let createdAuth0User = {}
      let loggedInUser = {}
      if (!createUserDto.is_social) {
        createdAuth0User = await this.createAuth0User(createUserDto, oauth)
        if (!createdAuth0User.data) {
          throw ono(createdAuth0User)
        }

        loggedInUser = await this.auth0UserLogin({
          email: createUserDto.username,
          password: createUserDto.password,
        })

        if (!loggedInUser.data) {
          throw ono(loggedInUser)
        }
      } else {
        createdAuth0User = await this.getExistingAuth0User(createUserDto.username, oauth)
        loggedInUser = {
          access_token: createUserDto.access_token,
          refresh_token: createUserDto.refresh_token,
        }
      }

      const newUserDto = {}
      let hashPassword = validation.hashPassword(createUserDto.password || process.env.DEFAULT_MASTO_PASSWORD)
      Object.assign(newUserDto, {
        ...createUserDto,
        auth0_user_id: createdAuth0User.data.user_id,
        password: hashPassword,
      })

      const auth0UserId = createdAuth0User.data.user_id.split('|')[1]

      const userDetails = {
        ...createUserDto,
        ...loggedInUser.data,
        auth0UserId: auth0UserId,
        mastodonUserId: mastodonUserData.id,
        mastodonAccessToken: mastodonUser.access_token,
        is_account_verified: false,
        is_password_verified: createUserDto.is_social,
        is_social: createUserDto.is_social,
      }

      const currentOne = new Date()
      const currentTwo = new Date(currentOne)
      const otp = 123456 //generateNumer.randomNumber()
      currentTwo.setMinutes(currentOne.getMinutes() + 30)

      const { user } = await this.createRedgistryUser(userDetails, oauth, otp, currentTwo)

      // if (createUserDto.login_with === 'email')
      await mailService.sendVerificationEmail(createUserDto.username, createdAuth0User.data.nickname, user.otp)

      // if (createUserDto.login_with === 'phone') await smsService.sendVerificationSMS(createUserDto.username, otp)

      return Object.assign({
        id: user.id,
        email: user.email,
        auth0_user_id: user.auth0_user_id,
        is_social: createUserDto.is_social,
        is_account_verified: user.is_account_verified,
        access_token: loggedInUser.access_token,
        refresh_token: loggedInUser.refresh_token,
        mastodon_user_id: mastodonUserData.id,
        mastodon_access_token: mastodonUser.access_token,
      })
    } catch (e) {
      throw ono({
        status: e.status && e.status === 200 ? e.status : 500,
        message: e.message,
      })
    }
  }

  async createRedgistryUser(userDetails, oauth, otp, otp_expiration) {
    let hashPassword = validation.hashPassword(userDetails.password || process.env.DEFAULT_MASTO_PASSWORD)
    const newUserDto = {
      auth0_user_id: userDetails.auth0UserId,
      mastodon_id: userDetails.mastodonUserId,
      email: userDetails.username,
      password: hashPassword,
      is_account_verified: userDetails.is_social ? true : false,
      is_password_verified: userDetails.is_password_verified,
      is_social: userDetails.is_social,
      otp_expiration,
      otp,
    }

    try {
      const user = await this.create(newUserDto)

      const {
        dataValues: { id: userId },
      } = user

      const registryToken = await this.createRedgistryToken(
        userId,
        userDetails.device_id,
        userDetails.access_token,
        userDetails.refresh_token,
        userDetails.mastodonAccessToken,
      )

      await UserRoles.create({ user_id: userId, role_id: 6 })
      await profiles.create({ user_id: userId })

      return { user, registryToken }
    } catch (err) {
      await this.deleteAccount(userDetails.auth0UserId)
      throw ono(err)
    }
  }

  async getRedgistryUserByAuth0Id(auth0Id) {
    const userData = await Users.findOne({
      where: { auth0_user_id: auth0Id },
      attribute: ['id', 'email', 'auth0_user_id', 'otp', 'is_account_verified', 'is_password_verified'],
    })

    return userData
  }

  async getRedgistryUserByEmail(email) {
    const userData = await Users.findOne({
      where: { email },
      attribute: ['id', 'email', 'auth0_user_id', 'otp', 'is_account_verified', 'is_password_verified', 'is_social'],
    })

    return userData
  }

  async getExistingAuth0User(email, oauth) {
    const result = await axios
      .get(`${this.auth0BaseUrl}/api/v2/users?q=email:` + email, {
        headers: auth0Header.baseHeaders(oauth),
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data[0],
        }
      })
      .catch((error) => {
        throw ono({
          status: error,
          message: error,
        })
      })

    return result
  }

  async createAuth0User(userDto, oauth) {
    const auth0UserData = {
      email: userDto.username,
      password: userDto.password,
      connection: this.auth0Connection,
      email_verified: true,
    }

    const auth0User = await axios
      .post(`${this.auth0BaseUrl}/api/v2/users`, auth0UserData, {
        headers: { Authorization: auth0Header.baseHeaders(oauth).Authorization },
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        }
      })
      .catch((error) => {
        throw ono({
          status: error.response.status,
          message: error.response.data.error,
        })
      })

    return auth0User
  }

  async auth0UserLogin(loginUserDto) {
    const oauth = await auth0.getAccessToken()
    if (oauth.status < 200 && oauth.status > 299) {
      throw ono({
        status: 400,
        message: 'Invalid access token',
      })
    }

    const result = await axios
      .post(
        `${this.auth0BaseUrl}/oauth/token`,
        {
          grant_type: 'password',
          client_id: this.auth0ClientId,
          username: loginUserDto.email,
          client_secret: this.auth0ClientSecret,
          password: loginUserDto.password,
          scope: 'openid read:profile offline_access',
          audience: 'https://redgistry.com',
        },
        {
          headers: {
            Authorization: auth0Header.baseHeaders(oauth).Authorization,
            'Accept-Encoding': 'gzip,deflate,compress',
          },
        },
      )
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        }
      })
      .catch((error) => {
        throw ono({
          status: error.response.status,
          message: error.response.data.error,
        })
      })
    return result
  }

  async createMastodonUser(email, password) {
    const date = new Date()
    const milliseconds = date.getTime()
    const config = await getMastodonHeaderConfig()

    const data = {
      username: `${milliseconds}`,
      password: password,
      email: email,
      agreement: true,
      locale: 'en',
      confirm: true,
      skip_confirmation: true,
    }

    return axios
      .post(`${process.env.MASTODON_INSTANCE_URI}/api/v1/accounts`, data, config)
      .then((response) => response.data)
      .catch((error) => {
        throw ono({ status: false, message: error.response.data.error })
      })
  }

  async mastodonLogin(email) {
    const user = await this.getMastodonUser(email)
    await mastodonModels.users.update({ approved: true, confirmed_at: new Date().toISOString() }, { where: { email } })

    const token = await this.getMastodonToken(user)
    return { id: user.id, email: user.email, oauth_access_tokens: token }
  }

  async getMastodonUser(email) {
    const user = await mastodonModels.users.findOne({ where: { email }, attributes: ['id', 'email', 'account_id'] })
    if (!user) {
      throw ono({ status: 404, message: 'Mastodon user not found.' })
    } // TO CREATE MASTODON USER WILL NOT NEEDED HERE BECAUSE WILL SIGNUP USER ONCE WE CREATE A USER IN OUR REDGISTRY DATABASE

    return user.dataValues
  }

  async getMastodonToken(user) {
    let token = await mastodonModels.oauth_access_tokens.findAll({
      where: { resource_owner_id: user.id, application_id: process.env.MASTODON_APPLICATION_ID },
      attributes: ['id', 'resource_owner_id', 'application_id', 'scopes', 'token'],
      order: [['created_at', 'ASC']],
    })

    if (token.length === 0)
      return this.createMastodonToken({
        token: uuid(),
        resource_owner_id: user.id,
        created_at: new Date().toISOString(),
      }) // IF SIGNUP API PROVIDE ACCESS TOKEN THIS CREATE ACCESS TOKEN WILL NOT NEEDED.

    await mastodonModels.users.update({ last_used_at: new Date().toISOString() }, { where: { email: user.email } })
    return token
  }

  async createMastodonToken(data) {
    const token = mastodonModels.oauth_access_tokens.create({
      token: data.token,
      scopes: process.env.MASTODON_SCOPES,
      application_id: process.env.MASTODON_APPLICATION_ID,
      resource_owner_id: data.resource_owner_id,
      created_at: data.created_at,
    })

    return token
  }

  async createRedgistryToken(user_id, device_id, access_token, refresh_token, mastodon_access_token) {
    await UserSession.destroy({ where: { user_id, device_id: device_id } })

    const data = await UserSession.create({
      created_at: new Date(),
      updated_at: new Date(),
      user_id,
      device_id,
      access_token,
      refresh_token,
      mastodon_access_token,
    })

    return data
  }

  async loginUser(loginDto) {
    try {
      const redistryUser = await this.model.findOne({ where: { email: loginDto.username } })
      let auth0User
      if (!loginDto.is_social) {
        auth0User = await this.auth0UserLogin({ email: loginDto.username, password: loginDto.password })
        if (!auth0User.data) {
          return {
            statusCode: 400,
            message: 'invalid username or password',
          }
        }
      } else {
        auth0User = {
          data: {
            access_token: loginDto.access_token,
            refresh_token: loginDto.refresh_token,
          },
        }
      }

      // can be remove after onboad flow is mandatory
      const onboardDetails = await redgistryModels.Onboardings.findOne({
        where: { user_id: redistryUser.id },
        attributes: ['first_name', 'last_name'],
        raw: true,
      })

      if (onboardDetails && onboardDetails.first_name) {
        await updateMastodonUserDetails({
          display_name: `${
            onboardDetails.first_name !== undefined && onboardDetails.first_name !== null
              ? ` ${onboardDetails.first_name} `
              : ''
          }${
            onboardDetails.last_name !== undefined && ` ${onboardDetails.last_name} ` !== null
              ? onboardDetails.last_name
              : ''
          }`,
          email: loginDto.username,
        })
      }

      const mastodonToken = await this.mastodonLogin(loginDto.username)
      const loggedInUser = await this.model.findOne({ where: { email: loginDto.username } })

      if (!loggedInUser) {
        throw ono({
          status: false,
          statusCode: 404,
          message: 'invalid username or password',
        })
      }

      if (loggedInUser.is_account_verified === false) {
        throw ono({
          status: 401,
          message: 'User account not verified',
        })
      }

      this.createRedgistryToken(
        loggedInUser.dataValues.id,
        loginDto.device_id,
        auth0User.data.access_token,
        auth0User.data.refresh_token,
        mastodonToken.oauth_access_tokens[mastodonToken.oauth_access_tokens.length - 1].token,
      )

      const onboarding = await Onboardings.findOne({
        where: { user_id: loggedInUser.id },
        include: [{ model: UsersTypes, as: 'UsersType' }],
      })

      delete loggedInUser.dataValues.password
      return Object.assign({
        ...loggedInUser.dataValues,
        access_token: auth0User.data.access_token,
        refresh_token: auth0User.data.refresh_token,
        mastodon_access_token: mastodonToken.oauth_access_tokens[mastodonToken.oauth_access_tokens.length - 1].token,
        onboarding,
      })
    } catch (e) {
      throw ono(e)
    }
  }

  async socialLoginUser(auth0_user_id, body) {
    let mastodonUserData = await this.getMastodonUser(body.email)
    const registryUserData = await Users.findOne({ where: { email: body.email, is_social: true }, attribute: ['id'] })

    if (mastodonUserData && registryUserData) {
      const mastodonToken = await this.mastodonLogin(body.email)

      const registryToken = await this.createRedgistryToken(
        registryUserData.id,
        body.device_id,
        body.access_token,
        body.refresh_token,
        mastodonToken.oauth_access_tokens[mastodonToken.oauth_access_tokens.length - 1].token,
      )

      const onboarding = await Onboardings.findOne({
        where: { user_id: registryUserData.id },
        include: [{ model: UsersTypes, as: 'UsersType' }],
      })

      return Object.assign({
        id: registryUserData.id,
        auth0_user_id,
        email: registryUserData.email,
        is_social: registryUserData.is_social,
        is_account_verified: user.is_account_verified,
        access_token: registryToken.access_token,
        refresh_token: registryToken.refresh_token,
        mastodonAccessToken: mastodonUser.access_token,
        onboarding,
      })
    }

    const mastodonUser = await this.createMastodonUser(body.email, process.env.IS_SOCIAL_IS_SOCIAL_DEFAULT_PASSWORD)
    mastodonUserData = await this.getMastodonUser(body.email)

    const userDetails = {
      auth0UserId: body.auth0UserId,
      mastodonUserId: mastodonUserData.id,
      username: body.email,
      password: process.env.IS_SOCIAL_IS_SOCIAL_DEFAULT_PASSWORD,
      is_account_verified: true,
      is_password_verified: false,
      is_social: true,
      device_id: body.device_id,
      access_token: body.access_token,
      refresh_token: body.refresh_token,
      mastodonAccessToken: mastodonUser.access_token,
    }

    const { user, registryToken } = await this.createRedgistryUser(userDetails, oauth, null, null)

    const onboarding = await Onboardings.findOne({
      where: { user_id: user.id },
      include: [{ model: UsersTypes, as: 'UsersType' }],
    })

    return Object.assign({
      id: user.id,
      auth0_user_id,
      email: user.email,
      is_social: user.is_social,
      is_account_verified: user.is_account_verified,
      access_token: registryToken.access_token,
      refresh_token: registryToken.refresh_token,
      mastodonAccessToken: mastodonUser.access_token,
      onboarding,
    })
  }

  async auth0UserPasswordChange(userId, password) {
    const oauth = await auth0.getAccessToken()
    const result = await axios
      .patch(
        `${this.auth0BaseUrl}/api/v2/users/${userId}`,
        {
          connection: this.auth0Connection,
          password,
        },
        {
          headers: auth0Header.baseHeaders(oauth),
          'content-type': 'application/x-www-form-urlencoded',
        },
      )
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        }
      })
      .catch((error) => {
        throw ono({
          status: error.response.status,
          message: error.response.data,
        })
      })
    return result
  }

  async getAuth0UserById(userId) {
    const oauth = await auth0.getAccessToken()

    const result = await axios
      .get(
        `${this.auth0BaseUrl}/api/v2/users/auth0|${userId}`,

        {
          headers: auth0Header.baseHeaders(oauth),
          'content-type': 'application/x-www-form-urlencoded',
        },
      )
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        }
      })
      .catch((error) => {
        throw ono({
          status: error.response.status,
          message: error.response.data,
        })
      })

    return result
  }

  async getUserById(userId) {
    try {
      const user = await this.getById(userId)

      const authUser = await this.getAuth0UserById(user.auth0_user_id)
      return authUser
    } catch (e) {
      throw ono(e)
    }
  }

  async changePassword(auth0_user_id, body) {
    try {
      const password = validation.hashPassword(body.password)
      const authUser = await this.getAuth0UserById(auth0_user_id)
      if (authUser.status !== 200) {
        throw ono({
          status: false,
          message: authUser.message.message,
        })
      }

      const redgistryUser = await this.getRedgistryUserByAuth0Id(auth0_user_id)
      if (!redgistryUser) {
        throw ono({
          status: 404,
          message: 'Redgistry user not found.',
        })
      }

      if (redgistryUser.is_password_verified === false) {
        throw ono({
          status: 400,
          message: 'Change password verification OTP is not verified.',
        })
      }

      if (redgistryUser.otp === null && redgistryUser.is_password_verified === true) {
        throw ono({
          status: 400,
          message: 'Password already changed',
        })
      }

      if (redgistryUser.is_social === true) {
        throw ono({
          status: 401,
          message: 'User account associated with social',
        })
      }

      const changePassword = await this.auth0UserPasswordChange(`auth0|${auth0_user_id}`, body.password)
      if (changePassword.status !== 200) {
        throw ono({
          status: 400,
          message: changePassword.message.message,
        })
      }

      if (redgistryUser.mastodon_id !== null) {
        await mastodonModels.users.update(
          { encrypted_password: password },
          { where: { id: redgistryUser.mastodon_id } },
        )
      }

      return await Users.update({ password, otp: null }, { where: { auth0_user_id } })
    } catch (error) {
      throw ono(error)
    }
  }

  async logoutUser(requestData) {
    try {
      const updated = await UserSession.update(
        {
          access_token: null,
        },
        {
          where: {
            user_id: requestData.user_id,
            device_id: requestData.device_id,
          },
        },
      )

      if (updated[0] === 1) {
        return true
      } else {
        return false
      }
    } catch (e) {
      throw ono(e)
    }
  }

  async sendAccountVerificationOTP(body) {
    try {
      const currentOne = new Date()
      const currentTwo = new Date(currentOne)
      const otp = 123456 //generateNumer.randomNumber()
      currentTwo.setMinutes(currentOne.getMinutes() + 30)

      if (body.login_with === 'email') {
        const user = await Users.findOne({ where: { email: body.mode } })

        if (!user) {
          throw ono({
            status: false,
            statusCode: 404,
            message: 'invalid username or password',
          })
        }

        await Users.update(
          { is_account_verified: false, otp, otp_expiration: currentTwo },
          { where: { email: body.mode } },
        )
        await mailService.sendVerificationEmail(body.mode, body.mode.split('@')[0], otp)
      }

      if (body.login_with === 'phone') {
        // const user = await this.model.findOne({ where: { phone: body.mode } })

        // if (!user) {
        //   throw ono({
        //     status: false,
        //     statusCode: 404,
        //     message: 'invalid username or password',
        //   })
        // }
        // await Users.update({ is_account_verified: false, otp, otp_expiration: currentTwo }, { where: { email: body.mode } })
        await smsService.sendVerificationSMS(body.mode, otp)
      }
    } catch (error) {
      throw ono(error)
    }
  }

  async verifyAccountVerificationOTP(body) {
    let user
    user = await Users.findOne({
      where: { email: body.mode },
      attribute: ['id', 'email', 'auth0_user_id', 'otp', 'is_account_verified', 'is_password_verified'],
    })

    if (!user) {
      throw ono({
        status: 404,
        message: 'User not found',
      })
    }

    if (!body.is_social) {
      if (user.is_account_verified === true) {
        throw ono({
          status: 400,
          message: 'Account already is verified',
        })
      }

      if (user.otp !== body.otp) {
        throw ono({
          status: 400,
          message: 'OTP provided incorrect',
        })
      }

      await Users.update(
        { is_account_verified: true, is_password_verified: true, otp: null, otp_expiration: null },
        { where: { id: user.id } },
      )
    }

    const token = await UserSession.findOne({ where: { user_id: user.id } })

    const onboarding = await Onboardings.findOne({
      where: { user_id: user.id },
      include: [{ model: UsersTypes, as: 'UsersType' }],
    })

    return { user, token, onboarding }
  }

  async sendChangePasswordOTP(body) {
    try {
      const currentOne = new Date()
      const currentTwo = new Date(currentOne)
      const otp = 123456 //generateNumer.randomNumber()
      currentTwo.setMinutes(currentOne.getMinutes() + 30)

      if (body.login_with === 'email') {
        const user = await Users.findOne({ where: { email: body.mode } })

        if (!user) {
          throw ono({
            status: false,
            statusCode: 404,
            message: 'invalid username or password',
          })
        }

        if (user.is_social === true) {
          throw ono({
            status: 401,
            message: 'User account associated with social',
          })
        }

        await Users.update(
          { is_password_verified: false, otp, otp_expiration: currentTwo },
          { where: { email: body.mode } },
        )
        await mailService.sendChangePasswordEmail(body.mode, body.mode.split('@')[0], otp)
      }

      if (body.login_with === 'phone') {
        if (user.is_social === true) {
          throw ono({
            status: 401,
            message: 'User account associated with social',
          })
        }

        await smsService.sendChangePasswordSMS(body.mode, otp)
      }
    } catch (error) {
      throw ono(error)
    }
  }

  async verifyChangePasswordOTP(body) {
    let user
    if (body.login_with === 'email') {
      user = await Users.findOne({
        where: { email: body.mode },
        attribute: ['id', 'email', 'auth0_user_id', 'otp', 'is_account_verified', 'is_password_verified'],
      })
    }

    if (body.login_with === 'phone') {
      user = await Users.findOne({
        where: { phone: body.mode },
        attribute: ['id', 'email', 'auth0_user_id', 'otp', 'is_account_verified', 'is_password_verified'],
      })
    }

    if (!user) {
      throw ono({
        status: 404,
        message: 'User not found',
      })
    }

    if (user.is_password_verified === true) {
      throw ono({
        status: 400,
        message: 'Change Password OTP already verified',
      })
    }

    if (user.is_social === true) {
      throw ono({
        status: 401,
        message: 'User account associated with social',
      })
    }

    if (user.otp !== body.otp) {
      throw ono({
        status: 400,
        message: 'OTP provided incorrect',
      })
    }

    await Users.update({ is_password_verified: true, otp_expiration: null }, { where: { email: body.mode } })

    const token = await UserSession.findOne({ where: { user_id: user.id } })

    const onboarding = await Onboardings.findOne({
      where: { user_id: user.id },
      include: [{ model: UsersTypes, as: 'UsersType' }],
    })

    return { user, token, onboarding }
  }

  async deleteAuth0User(auth0UserId) {
    const oauth = await auth0.getAccessToken()
    if (oauth.status < 200 && oauth.status > 299) {
      throw ono({ status: 400, message: 'Invalid client access token' })
    }

    const data = await axios
      .delete(`${this.auth0BaseUrl}/api/v2/users/${auth0UserId}`, {
        headers: { Authorization: auth0Header.baseHeaders(oauth).Authorization },
      })
      .then((result) => {
        return { status: result.status, data: result.data }
      })
      .catch((error) => {
        throw ono({ status: error.response.status, message: error.response.statusText })
      })

    if (data.status !== 200 && data.status !== 204 && data.status !== 404) {
      throw ono({ status: data.status, message: data.message })
    }
  }

  async deleteAccount(auth0_user_id) {
    const rEDgistryUser = await this.getRedgistryUserByAuth0Id(auth0_user_id)
    const mastodonUser = await mastodonModels.users.findOne({ where: { email: rEDgistryUser.email } })

    await this.deleteAuth0User(`auth0|${auth0_user_id}`)
    await Users.destroy({ where: { email: rEDgistryUser.email } })
    await UserSession.destroy({ where: { user_id: rEDgistryUser.id } })

    await mastodonModels.users.destroy({ where: { email: mastodonUser.email } })
    await mastodonModels.accounts.destroy({ where: { id: mastodonUser.account_id } })
    await mastodonModels.oauth_access_tokens.destroy({ where: { resource_owner_id: mastodonUser.id } })
  }

  async refreshAccessToken(id, refresh_token) {
    if (!refresh_token)
      throw ono({
        status: 400,
        message: 'refresh token is missing in request.',
      })
    if (!id)
      throw ono({
        status: 400,
        message: 'invalid access token.',
      })

    const token = await UserSession.findOne({ where: { refresh_token } })
    if (!token || token.refresh_token !== refresh_token)
      throw ono({
        status: 400,
        message: 'User does not exist for this refresh token.',
      })

    const result = await auth0.refreshAccessToken(refresh_token)
    return result
  }
}

module.exports = new AuthRepository(Users)
