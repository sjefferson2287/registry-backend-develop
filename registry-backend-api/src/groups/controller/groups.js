const groupRepository = require('../repository/groups.repository')
const response = require('../../shared/lib/response')
const utils = require('../../shared/utils')
const authRepository = require('../../auth/repository/auth.repository')

class GroupController {
  constructor(repository) {
    this.repository = repository
  }

  createGroup = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const body = JSON.parse(event.body)

      const data = await groupRepository.createGroup(body, user.id)
      return response.json(callback, data, 201, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  getGroup = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId } = event.pathParameters

      const data = await groupRepository.getGroup(groupId, user.id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  getAllGroupsOfCurrentUser = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)

      const data = await this.repository.getAllGroupsOfCurrentUser(user.id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  updateGroup = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId } = event.pathParameters
      const body = JSON.parse(event.body)

      const data = await groupRepository.updateGroup(body, groupId, user.id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  deleteGroup = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId } = event.pathParameters

      const data = await groupRepository.deleteGroup(groupId, user.id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  // GROUP MEMBER APIS

  getGroupMembers = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId } = event.pathParameters

      const data = await this.repository.getGroupMembers(groupId, user)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  joinGroup = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId } = event.pathParameters

      const data = await this.repository.joinGroup(groupId, user.id)
      return response.json(callback, data, 201, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  leaveGroup = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId } = event.pathParameters

      const data = await this.repository.leaveGroup(groupId, user.id)
      return response.json(callback, data, 201, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  removeGroupMember = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId, member_id: memberId } = event.pathParameters

      const data = await groupRepository.removeGroupMember(memberId, groupId, user.id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  // GROUP STATUSES

  addGroupStatus = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId } = event.pathParameters
      const body = JSON.parse(event.body)

      const data = await groupRepository.addGroupStatus(groupId, user, body)
      return response.json(callback, data, 201, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  editGroupStatus = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId, status_id: statusId } = event.pathParameters
      const body = JSON.parse(event.body)

      const data = await groupRepository.editGroupStatus(groupId, user, body, statusId)
      return response.json(callback, data, 201, 'Success')
    } catch (e) {
      return response.json(callback, [], 400, e.message)
    }
  }

  getGroupStatuses = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId } = event.pathParameters

      const data = await this.repository.getGroupStatuses(user, groupId)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  deleteGroupStatus = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId, status_id: statusId } = event.pathParameters

      const data = await this.repository.deleteGroupStatus(groupId, statusId, user.id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  toggleHideGroupStatus = async (event, context, callback) => {
    const auth0_user_id = utils.parseLoginUser(event)?.auth0_user_id
    try {
      const user = await authRepository.getRedgistryUserByAuth0Id(auth0_user_id)
      const { group_id: groupId, status_id: statusId } = event.pathParameters

      const data = await this.repository.toggleHideGroupStatus(groupId, statusId, user.id)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  addVisitToGroup = async (event, context, callback) => {
    try {
      const { group_id: groupId } = event.pathParameters
      const data = await this.repository.addVisitToGroup(groupId)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }

  searchGroup = async (event, context, callback) => {
    try {
      const { q } = event.queryStringParameters
      const data = await this.repository.searchGroups(q)
      return response.json(callback, data, 200, 'Success')
    } catch (e) {
      return response.json(callback, [], e.status, e.message)
    }
  }
}

module.exports = new GroupController(groupRepository)
