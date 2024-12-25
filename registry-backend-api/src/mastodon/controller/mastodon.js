const utils = require('../../shared/utils')
const response = require('../../shared/lib/response')
const mastodonRepository = require('../repository/mastodon.repository')
const authRepository = require('../../auth/repository/auth.repository')

class MastodonController {
  verifyCredentials = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const data = await mastodonRepository.verifyCredentials(user)
      return response.json(callback, data, 201, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  addStatus = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const body = JSON.parse(event.body)

      const data = await mastodonRepository.addStatus(user, body)
      return response.json(callback, data, 201, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  editStatus = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const body = JSON.parse(event.body)
      const { id } = event.pathParameters

      const data = await mastodonRepository.addStatus(user, body, id)
      return response.json(callback, data, 201, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  statusesContext = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { id: statusId } = event.pathParameters

      const data = await mastodonRepository.statusesContext(user, statusId)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  reblog = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { id: statusId } = event.pathParameters

      const data = await mastodonRepository.reblog(user, statusId)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  unReblog = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { id: statusId } = event.pathParameters

      const data = await mastodonRepository.unReblog(user, statusId)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  deleteStatus = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { id: statusId } = event.pathParameters

      const data = await mastodonRepository.deleteStatus(user, statusId)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  getStatus = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { id: statusId } = event.pathParameters

      const data = await mastodonRepository.getStatus(user, statusId)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  publicTimeline = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { queryStringParameters } = event
      const data = await mastodonRepository.publicTimeline(user, queryStringParameters)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  notifications = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { queryStringParameters } = event
      const data = await mastodonRepository.notifications(user, queryStringParameters)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  search = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { queryStringParameters } = event
      const data = await mastodonRepository.search(user, queryStringParameters)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  accountsSearch = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { queryStringParameters } = event
      const data = await mastodonRepository.accountsSearch(user, queryStringParameters)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  posts = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { queryStringParameters } = event
      const body = JSON.parse(event.body)
      const data = await mastodonRepository.posts(user, queryStringParameters, body)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  media = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { queryStringParameters } = event
      const body = JSON.parse(event.body)
      const data = await mastodonRepository.media(user, queryStringParameters, body)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }
}

module.exports = new MastodonController()
