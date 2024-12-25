const { default: ono } = require('@jsdevtools/ono')
const { default: axios } = require('axios')
const { v4: uuid } = require('uuid')
const { sequelize, Sequelize } = require('../../../database/mastodonDatabase/models')
const { MASTODON_API } = require('../apiConstants')
const mastodonModels = require('../../../database/mastodonDatabase/models')

const getMastodonHeaderConfig = async (token = null) => {
  if (token) return { headers: { Authorization: `Bearer ${token}` } }
  const { access_token, token_type } = await mastodonAuthorize()
  return { headers: { Authorization: `${token_type} ${access_token}` } }
}

const mastodonAuthorize = async () => {
  const config = {
    scope: process.env.MASTODON_SCOPES,
    client_id: process.env.MASTODON_CLIENT_ID,
    base_url: process.env.MASTODON_INSTANCE_URI,
    grant_type: process.env.MASTODON_GRANT_TYPE,
    redirect_uri: process.env.MASTODON_REDIRECT_URI,
    client_secret: process.env.MASTODON_CLIENT_SECRET,
  }

  const result = await axios
    .post(`${process.env.MASTODON_INSTANCE_URI}${MASTODON_API.O_AUTH_TOKEN}`, config)
    .then((response) => response.data)
    .catch((error) => {
      throw ono({ status: false, message: error })
    })

  return result
}

const createMastodonToken = async (data) => {
  const token = await mastodonModels.oauth_access_tokens.create({
    token: data.token,
    scopes: process.env.MASTODON_SCOPES,
    application_id: process.env.MASTODON_APPLICATION_ID,
    resource_owner_id: data.resource_owner_id,
    created_at: data.created_at,
  })

  return token
}

const getMastodonUser = async (email) => {
  const user = await mastodonModels.users.findOne({ where: { email }, attributes: ['id', 'email', 'account_id'] })
  if (!user) {
    throw ono({ status: 404, message: 'Mastodon user not found.' })
  } // TO CREATE MASTODON USER WILL NOT NEEDED HERE BECAUSE WILL SIGNUP USER ONCE WE CREATE A USER IN OUR REDGISTRY DATABASE

  return user.dataValues
}

const getMastodonTokenByUser = async (user) => {
  let token = await mastodonModels.oauth_access_tokens.findAll({
    where: { resource_owner_id: user.id, application_id: process.env.MASTODON_APPLICATION_ID },
    attributes: ['id', 'resource_owner_id', 'application_id', 'scopes', 'token'],
    order: [['created_at', 'ASC']],
  })

  if (token.length === 0)
    return createMastodonToken({
      token: uuid(),
      resource_owner_id: user.id,
      created_at: new Date().toISOString(),
    }) // IF SIGNUP API PROVIDE ACCESS TOKEN THIS CREATE ACCESS TOKEN WILL NOT NEEDED.

  await mastodonModels.users.update({ last_used_at: new Date().toISOString() }, { where: { email: user.email } })
  return token
}

const updateMastodonUserDetails = async (data) => {
  const { mastodonAccessToken } = await mastodonLoginByEmail(data.email)
  const config = await getMastodonHeaderConfig(mastodonAccessToken)
  if (data.display_name === '') return

  return axios
    .patch(`${process.env.MASTODON_INSTANCE_URI}${MASTODON_API.UPDATE_CREDENTIALS}`, data, config)
    .then((response) => response.data)
    .catch((error) => {
      throw ono({ status: false, message: error })
    })
}

const mastodonLoginByEmail = async (email) => {
  const user = await getMastodonUser(email)
  await mastodonModels.users.update({ approved: true, confirmed_at: new Date().toISOString() }, { where: { email } })

  const oauth_access_tokens = await getMastodonTokenByUser(user)
  const mastodonAccessToken = oauth_access_tokens[oauth_access_tokens.length - 1]?.token
  return { id: user.id, account_id: user.account_id, email: user.email, mastodonAccessToken }
}

const searchByQueryAndToken = async (q, token) => {
  const config = await getMastodonHeaderConfig(token)
  try {
    let { data } = await axios.get(
      `${process.env.MASTODON_INSTANCE_URI}${MASTODON_API.SEARCH(q)}&resolve=true&limit=5`,
      config,
    )
    return data
  } catch (err) {
    throw ono({ status: false, message: err.message })
  }
}

const getMastodonAccountDetailsApiService = async (id, token) => {
  const config = await getMastodonHeaderConfig(token)
  try {
    let { data } = await axios.get(`${process.env.MASTODON_INSTANCE_URI}${MASTODON_API.ACCOUNTS(id)}`, config)
    return data
  } catch (err) {
    throw ono({ status: false, message: err.message })
  }
}

const getMastodonUsersAccountDetails = async (mastodonUserIdRedUserIdObj, email) => {
  const accountsDetailsPromises = []

  try {
    const mastodonUsers = await mastodonModels.users.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: Object.keys(mastodonUserIdRedUserIdObj),
        },
      },
      attributes: ['id', 'account_id'],
      raw: true,
    })

    const { mastodonAccessToken } = await mastodonLoginByEmail(email)

    const mastodonAccIdRedUserIdObj = {}
    for (let i = 0; i < mastodonUsers.length; i++) {
      const currMastodonUser = mastodonUsers[i]
      mastodonAccIdRedUserIdObj[currMastodonUser.account_id] = mastodonUserIdRedUserIdObj[currMastodonUser.id]
      const result = getMastodonAccountDetailsApiService(currMastodonUser.account_id, mastodonAccessToken)
      accountsDetailsPromises.push(result)
    }
    const accountsDetails = await Promise.all(accountsDetailsPromises)
    const accounts = accountsDetails.map((curr) => ({ ...curr, id: mastodonAccIdRedUserIdObj[curr.id] }))
    return accounts
  } catch (e) {
    console.log(e)
    return []
  }
}

const getAuthorizationOfUserByStatusId = async (id) => {
  // const { rows } = await Status.findAndCountAll({
  //   attributes: ['id'],
  //   include: [
  //     {
  //       model: users,
  //       attributes: ['id'],
  //     },
  //   ],
  //   where: { id },
  // })
  const [results] = await sequelize.query(
    `select oat.token from statuses s join users u 
     on s.account_id = u.account_id
     join oauth_access_tokens oat 
     on u.id = oat.resource_owner_id 
     where s.id=${id}`,
  )
  if (results.length === 0) throw ono({ status: 400, message: 'Status not found' })

  const { token } = results[0]
  return getMastodonHeaderConfig(token)
}

const deleteStatusById = async (statusId) => {
  const config = await getAuthorizationOfUserByStatusId(statusId)
  try {
    const { data } = await axios.delete(
      `${process.env.MASTODON_INSTANCE_URI}${MASTODON_API.DELETE_STATUS(statusId)}`,
      config,
    )
    return data
  } catch (err) {
    throw ono({ status: false, message: err.message })
  }
}

module.exports = {
  getMastodonHeaderConfig,
  updateMastodonUserDetails,
  deleteStatusById,
  searchByQueryAndToken,
  getMastodonTokenByUser,
  getMastodonUser,
  mastodonLoginByEmail,
  getMastodonUsersAccountDetails,
}
