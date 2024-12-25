const ono = require('@jsdevtools/ono')
const axios = require('axios')
const { MASTODON_API } = require('../apiConstants')
const { getMastodonHeaderConfig, mastodonLoginByEmail } = require('./mastodon.service')

const statusesContext = async (email, statusId) => {
  const { mastodonAccessToken } = await mastodonLoginByEmail(email)
  const config = await getMastodonHeaderConfig(mastodonAccessToken)
  try {
    let result = await axios.get(
      `${process.env.MASTODON_INSTANCE_URI}${MASTODON_API.STATUSES_CONTEXT(statusId)}`,
      config,
    )
    return result.data
  } catch (err) {
    throw ono({ status: false, message: err.message })
  }
}

const reblog = async (email, statusId) => {
  const { mastodonAccessToken } = await mastodonLoginByEmail(email)
  const config = await getMastodonHeaderConfig(mastodonAccessToken)
  try {
    let result = await axios.post(`${process.env.MASTODON_INSTANCE_URI}${MASTODON_API.REBLOG(statusId)}`, null, config)
    return result.data
  } catch (err) {
    throw ono({ status: false, message: err.message })
  }
}

const unReblog = async (email, statusId) => {
  const { mastodonAccessToken } = await mastodonLoginByEmail(email)
  const config = await getMastodonHeaderConfig(mastodonAccessToken)
  try {
    let result = await axios.post(
      `${process.env.MASTODON_INSTANCE_URI}${MASTODON_API.UN_REBLOG(statusId)}`,
      null,
      config,
    )
    return result.data
  } catch (err) {
    throw ono({ status: false, message: err.message })
  }
}

const deleteStatus = async (email, statusId) => {
  const { mastodonAccessToken } = await mastodonLoginByEmail(email)
  const config = await getMastodonHeaderConfig(mastodonAccessToken)
  try {
    let result = await axios.delete(
      `${process.env.MASTODON_INSTANCE_URI}${MASTODON_API.DELETE_STATUS(statusId)}`,
      config,
    )
    return result.data
  } catch (err) {
    throw ono({ status: false, message: err.message })
  }
}

const verifyCredentials = async (email) => {
  const { mastodonAccessToken } = await mastodonLoginByEmail(email)
  const config = await getMastodonHeaderConfig(mastodonAccessToken)
  try {
    let result = await axios.get(`${process.env.MASTODON_INSTANCE_URI}${MASTODON_API.VERIFY_CREDENTIALS}`, config)
    return result.data
  } catch (err) {
    throw ono({ status: false, message: err.message })
  }
}

const publicTimeline = async (email, queryParams) => {
  const { mastodonAccessToken, account_id } = await mastodonLoginByEmail(email)
  const config = await getMastodonHeaderConfig(mastodonAccessToken)
  if (queryParams) {
    config.params = queryParams
  }
  try {
    let { data } = await axios.get(`${process.env.MASTODON_INSTANCE_URI}${MASTODON_API.TIMELINE}`, config)
    data = data
      .filter((d) => d.spoiler_text != 'group')
      .map((d) => {
        return {
          ...d,
          account: {
            ...d.account,
            is_current_user: d?.account?.id === account_id,
          },
        }
      })
    return data
  } catch (err) {
    throw ono({ status: false, message: err.message })
  }
}

const makeMastodonApiCall = async ({ email, params, api, body, id }) => {
  const { mastodonAccessToken } = await mastodonLoginByEmail(email)
  const config = await getMastodonHeaderConfig(mastodonAccessToken)
  if (params) {
    config.params = params
  }
  let result = {}
  let currUrl = `${process.env.MASTODON_INSTANCE_URI}${api}`
  try {
    if (id && body) {
      currUrl = `${currUrl}/${id}`
      result = await axios.put(currUrl, body, config)
    } else if (body) {
      result = await axios.post(currUrl, body, config)
    } else {
      result = await axios.get(currUrl, config)
    }
    return result.data
  } catch (err) {
    throw ono({ status: false, message: err.message })
  }
}

const getStatusesByIds = async (email, statusIds) => {
  try {
    const data = await publicTimeline(email)
    const statuses = data.filter((status) => statusIds.includes(status.id))
    return statuses
  } catch (err) {
    throw ono({ status: false, message: err.message })
  }
}

module.exports = {
  verifyCredentials,
  publicTimeline,
  reblog,
  unReblog,
  statusesContext,
  getStatusesByIds,
  makeMastodonApiCall,
  deleteStatus,
}
