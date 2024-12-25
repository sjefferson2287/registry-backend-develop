const profileRepository = require('../repository/profile')
const response = require('../../shared/lib/response')
const utils = require('../../shared/utils')
const { getIsUniqueEmailMsg } = require('../../../src/common/utils')

const authRepository = require('../../auth/repository/auth.repository')

class ProfileController {
  static async updateStudentProfile(event, context, callback) {
    try {
      const body = JSON.parse(event.body)
      const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id

      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)

      const { step } = event.queryStringParameters

      const data = await profileRepository.updateStudentProfile(body, step, user.id)
      return response.json(callback, data, 200, 'Student profile updated successfully')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async updateParentProfile(event, context, callback) {
    try {
      const body = JSON.parse(event.body)
      const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id

      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)

      const { step } = event.queryStringParameters

      const data = await profileRepository.updateParentProfile(body, step, user.id)
      return response.json(callback, data, 200, 'Parent profile updated successfully')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getProfileData(event, context, callback) {
    try {
      const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id

      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)

      const data = await profileRepository.getProfileData(user)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getChildrenOfParentProfile(event, context, callback) {
    try {
      const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id

      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)

      const data = await profileRepository.getChildrenOfParentProfile(user)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async getParentsOfChildProfile(event, context, callback) {
    try {
      const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id

      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)

      const data = await profileRepository.getParentsOfChildProfile(user)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  static async inviteParent(event, context, callback) {
    try {
      const body = JSON.parse(event.body)
      const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id

      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)

      const data = await profileRepository.inviteParent(user, body)
      return response.json(callback, data, 200, 'Parent invited successfully')
    } catch (e) {
      return response.json(callback, {}, e.status || 400, getIsUniqueEmailMsg(e, 'Parent is already invited.'))
    }
  }

  static async inviteChild(event, context, callback) {
    try {
      const body = JSON.parse(event.body)
      const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id

      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)

      const data = await profileRepository.inviteChild(user, body)
      return response.json(callback, data, 200, 'Child invited successfully')
    } catch (e) {
      return response.json(callback, [], e.status || 400, getIsUniqueEmailMsg(e, 'Child is already invited.'))
    }
  }

  static async myInvitations(event, context, callback) {
    try {
      const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id

      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)

      const data = await profileRepository.myInvitations(user)
      return response.json(callback, data, 200, 'successfull')
    } catch (e) {
      return response.json(callback, [], 500, e.message)
    }
  }

  static async deleteInvitation(event, context, callback) {
    try {
      const body = JSON.parse(event.body)
      const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id

      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)

      const data = await profileRepository.deleteInvitation(user, body)
      return response.json(callback, data, 200, 'Invitation deleted successfully')
    } catch (e) {
      return response.json(callback, [], e.status || 400, e.message)
    }
  }
}

module.exports = ProfileController
