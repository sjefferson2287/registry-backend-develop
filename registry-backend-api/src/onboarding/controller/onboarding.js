const onboardingRepository = require('../repository/onboarding')
const response = require('../../shared/lib/response')
const utils = require('../../shared/utils')

class OnboardingController {
  static async createStudentOnboarding(event, context, callback) {
    try {
      const body = JSON.parse(event.body)
      body.auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id

      const data = await onboardingRepository.createStudentOnboarding(body)
      return response.json(callback, data, 200, 'Student onboarded successfully')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async createParentOnboarding(event, context, callback) {
    try {
      const body = JSON.parse(event.body)
      body.auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id

      const data = await onboardingRepository.createParentOnboarding(body)
      return response.json(callback, data, 200, 'Parent onboarded successfully')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async viewOnboarding(event, context, callback) {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await onboardingRepository.viewUserByAuth0Id(auth0_user_id)
      const data = await onboardingRepository.viewOnboardingByUserId(user.id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async viewUsersTypes(event, context, callback) {
    try {
      const data = await onboardingRepository.viewUsersTypes()
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getInvitedUserDetail(event, context, callback) {
    try {
      const data = await onboardingRepository.getInvitedUserDetail(event.queryStringParameters.email)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }
}

module.exports = OnboardingController
