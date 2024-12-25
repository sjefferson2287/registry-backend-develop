const connectionsRepository = require('../repository/connections.repository')
const response = require('../../shared/lib/response')
const utils = require('../../shared/utils')
const authRepository = require('../../auth/repository/auth.repository')

class ConnectionsController {
  constructor(repository) {
    this.repository = repository
  }

  connect = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { connection_id: connectionId } = event.pathParameters

      const data = await this.repository.connect(user.id, connectionId)
      return response.json(callback, data, 201, 'Success')
    } catch (e) {
      const error = e?.original?.code == '23505' ? 'User already requested for connection.' : null
      return response.json(callback, [], 400, error || e.message)
    }
  }

  acceptConnection = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { connection_id: connectionId } = event.pathParameters

      const data = await this.repository.acceptConnection(user.id, connectionId)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      const error = e?.original?.code == '23505' ? 'User already requested for connection.' : null
      return response.json(callback, [], 400, error || e.message)
    }
  }

  declineConnection = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { connection_id: connectionId } = event.pathParameters

      const data = await this.repository.declineConnection(Number(user.id), Number(connectionId))
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      const error = e?.original?.code == '23505' ? 'User already requested for connection.' : null
      return response.json(callback, [], 400, error || e.message)
    }
  }
}

module.exports = new ConnectionsController(connectionsRepository)
