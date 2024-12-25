const { MASTODON_API } = require('../../common/apiConstants')
const {
  verifyCredentials,
  publicTimeline,
  reblog,
  statusesContext,
  unReblog,
  deleteStatus,
  makeMastodonApiCall,
} = require('../../common/services/mastodon-apis.service')

class MastodonRepository {
  verifyCredentials = async (user) => {
    const result = await verifyCredentials(user.email)
    return result
  }

  addStatus = async (user, body, id) =>
    makeMastodonApiCall({ email: user.email, api: MASTODON_API.CREATE_STATUS, body, id })

  statusesContext = async (user, statusId) => {
    let result = await statusesContext(user.email, statusId)
    return result
  }

  reblog = async (user, statusId) => {
    let result = await reblog(user.email, statusId)
    return result
  }

  unReblog = async (user, statusId) => {
    let result = await unReblog(user.email, statusId)
    return result
  }

  deleteStatus = async (user, statusId) => {
    let result = await deleteStatus(user.email, statusId)
    return result
  }

  getStatus = async (user, statusId) =>
    makeMastodonApiCall({ email: user.email, params: queryParams, api: MASTODON_API.DELETE_STATUS(statusId) })

  publicTimeline = async (user, params) => await publicTimeline(user.email, params)

  notifications = (user, params) => makeMastodonApiCall({ email: user.email, params, api: MASTODON_API.NOTIFICATIONS })

  search = (user, params) => makeMastodonApiCall({ email: user.email, params, api: MASTODON_API.SEARCH })

  accountsSearch = (user, params) =>
    makeMastodonApiCall({ email: user.email, params, api: MASTODON_API.ACCOUNTS_SEARCH })

  posts = (user, params, body) => makeMastodonApiCall({ email: user.email, params, api: MASTODON_API.POSTS, body })

  media = (user, params, body) => makeMastodonApiCall({ email: user.email, params, api: MASTODON_API.MEDIA, body })
}

module.exports = new MastodonRepository()
