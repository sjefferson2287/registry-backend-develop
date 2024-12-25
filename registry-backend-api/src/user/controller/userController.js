const utils = require('../../shared/utils')
const response = require('../../shared/lib/response')
const aws = require('../../common/services/uploadImage')
const userRepository = require('../repository/userRepository')

class UserController {
  static async uploadImage(event, context, callback) {
    try {
      const data = await aws.uploadImage(event, context)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async updateStudentProfile(event, context, callback) {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const body = JSON.parse(event.body)
      const data = await userRepository.updateUserProfile(auth0_user_id, body)

      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async updateAccademic(event, context, callback) {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const body = JSON.parse(event.body)
      const data = await userRepository.updateAccademic(auth0_user_id, event.pathParameters.accademic_id, body)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }
}

module.exports = UserController
