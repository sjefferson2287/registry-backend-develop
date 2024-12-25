const response = require('../../shared/lib/response')
const utils = require('../../shared/utils')
const authRepository = require('../../auth/repository/auth.repository')
const twilioRepository = require('../repository/twilio.repository')

class TwilioController {
  constructor(repository) {
    this.repository = repository
  }

  getTwilioAccessToken = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const data = this.repository.getTwilioAccessToken(user)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 500, e)
    }
  }

  getUsersList = async (event, context, callback) => {
    try {
      const { q } = event.queryStringParameters
      const data = await this.repository.getUsersList(q)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], 500, e)
    }
  }
}

module.exports = new TwilioController(twilioRepository)
