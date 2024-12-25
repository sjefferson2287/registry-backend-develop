const searchRepository = require('../repository/search.repository')
const response = require('../../shared/lib/response')
const utils = require('../../shared/utils')
const authRepository = require('../../auth/repository/auth.repository')

class SearchController {
  constructor(repository) {
    this.repository = repository
  }

  searchByQuery = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const q = event.queryStringParameters
      const data = await this.repository.searchByQuery(q, user)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }
}

module.exports = new SearchController(searchRepository)
