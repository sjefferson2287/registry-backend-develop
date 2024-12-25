const universityRepository = require('../repository/university.repository')
const response = require('../../shared/lib/response')
const utils = require('../../shared/utils')
const authRepository = require('../../auth/repository/auth.repository')

class UniversityController {
  constructor(repository) {
    this.repository = repository
  }

  // createUniversity = async (event, context, callback) => {
  //   const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
  //   try {
  //     const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
  //     const body = JSON.parse(event.body)

  //     const data = await universityRepository.createUniversity(body, user.id)
  //     return response.json(callback, data, 201, 'Success')
  //   } catch (e) {
  //     return response.json(callback, [], 400, e.message)
  //   }
  // }

  getUniversity = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { id: groupId } = event.pathParameters

      const data = await universityRepository.getUniversity(groupId, user.id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  followUniversity = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { id: universityId } = event.pathParameters

      const data = await universityRepository.followUniversity(universityId, user.id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  searchUniversityByQuery = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const q = event.queryStringParameters
      const data = await this.repository.searchUniversityByQuery(q, user)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }
}

module.exports = new UniversityController(universityRepository)
