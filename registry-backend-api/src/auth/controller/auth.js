const authRepository = require('../repository/auth.repository')
const validation = require('../validation/validation')
const response = require('../../shared/lib/response')
const utils = require('../../shared/utils')
const jwt_decode = require('jwt-decode')
class AuthController {
  constructor(repository) {
    this.repository = repository
    this.createUser = this.createUser.bind(this)
    this.loginUser = this.loginUser.bind(this)
    this.logoutUser = this.logoutUser.bind(this)
  }

  async createUser(event, context, callback) {
    try {
      const record = await this.repository.createUser(JSON.parse(event.body))
      return response.json(callback, record, 200, 'Registration successful')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  async loginUser(event, context, callback) {
    try {
      const loggednUser = await this.repository.loginUser(JSON.parse(event.body))
      return response.json(callback, loggednUser, 200, 'Login successfully')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  async socialLoginUser(event, context, callback) {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const googleLoggednUser = await authRepository.socialLoginUser(auth0_user_id, JSON.parse(event.body))
      return response.json(callback, googleLoggednUser, 200, 'Logged successfully')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  async logoutUser(event, context, callback) {
    try {
      await this.repository.logoutUser(JSON.parse(event.body))
      return response.json(callback, [], 200, 'Logout successful')
    } catch (e) {
      return response.json(callback, [], e.status, 'Failed to logout')
    }
  }

  async refreshAccessToken(event, context, callback) {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const body = JSON.parse(event.body)
      const result = await authRepository.refreshAccessToken(user, body.refresh_token)
      return response.json(callback, result, 200)
    } catch (err) {
      return response.json(callback, [], err.status, err.message)
    }
  }

  async authRedgistry(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false

    if (!event.authorizationToken) return callback('Access token not found')

    const tokenParts = event.authorizationToken.split(' ')
    const tokenValue = tokenParts[1] || tokenParts[0]

    if (!((tokenParts[0].toLowerCase() === 'bearer' || tokenParts[0] === tokenValue) && tokenValue)) {
      return callback('Invalid token format')
    }

    try {
      const decoded = jwt_decode(tokenValue)
      const auth0_user_id = decoded.sub.split('|')[1]

      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      if (!user) return callback('Invalid access token')
      if (user.is_account_verified === false) return callback('User account is not verified')

      delete decoded.aud
      decoded.auth0_user_id = auth0_user_id
      const policy = validation.generatePolicy(decoded.auth0_user_id, decoded, 'Allow', '*')

      callback(null, policy)
    } catch (err) {
      return response.json(callback, [], err.status, err.message)
    }
  }

  async sendAccountVerificationOTP(event, context, callback) {
    try {
      const body = JSON.parse(event.body)
      await authRepository.sendAccountVerificationOTP(body)
      return response.json(callback, [], 200, 'Verify account OTP sent successfully.')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  async verifyAccountVerificationOTP(event, context, callback) {
    try {
      const body = JSON.parse(event.body)
      const { user, token, onboarding } = await authRepository.verifyAccountVerificationOTP(body)

      const data = {
        id: user.id,
        email: user.email,
        auth0_user_id: user.auth0_user_id,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        mastodon_access_token: token.mastodon_access_token,
        onboarding,
      }

      return response.json(callback, data, 200, 'Account verified successfully.')
    } catch (err) {
      return response.json(callback, [], err.status, err.message)
    }
  }

  async sendChangePasswordOTP(event, context, callback) {
    try {
      const body = JSON.parse(event.body)
      await authRepository.sendChangePasswordOTP(body)
      return response.json(callback, [], 200, 'Change password OTP sent successfully.')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  async verifyChangePasswordOTP(event, context, callback) {
    try {
      const body = JSON.parse(event.body)
      const { user, token, onboarding } = await authRepository.verifyChangePasswordOTP(body)

      const data = {
        id: user.id,
        email: user.email,
        auth0_user_id: user.auth0_user_id,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        mastodon_access_token: token.mastodon_access_token,
        onboarding,
      }

      return response.json(callback, data, 200, 'Change Password OTP verified successfully.')
    } catch (err) {
      return response.json(callback, [], err.status, err.message)
    }
  }

  async changePassword(event, context, callback) {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const body = JSON.parse(event.body)
      await this.repository.changePassword(auth0_user_id, body)
      return response.json(callback, [], 200, 'Password changed successfully.')
    } catch (err) {
      return response.json(callback, [], err.status, err.message)
    }
  }

  async deleteAccount(event, context, callback) {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      await authRepository.deleteAccount(auth0_user_id)
      return response.json(callback, [], 200, 'Account deleted successfully.')
    } catch (err) {
      return response.json(callback, [], err.status, err.message)
    }
  }
}

module.exports = new AuthController(authRepository)
