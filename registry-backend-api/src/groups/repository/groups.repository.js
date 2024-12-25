const BaseService = require('../../common/services/base.service')
const redgistryModels = require('../../../database/redgistryDatabase/models')
const { snakeToCamel } = require('../../common/utils')
const { default: ono } = require('@jsdevtools/ono')
const { deleteStatusById, getMastodonUsersAccountDetails } = require('../../common/services/mastodon.service')
const { getStatusesByIds, makeMastodonApiCall } = require('../../common/services/mastodon-apis.service')
const { Sequelize, sequelize } = require('../../../database/redgistryDatabase/models')
const { MASTODON_API } = require('../../common/apiConstants')

const { Users, Group, GroupsUsers, GroupsStatuses } = redgistryModels

class GroupRepository extends BaseService {
  constructor(model) {
    super(model)
    this.model = model
  }

  createGroup = async (createGroupDto, userId) => {
    const data = await this.create({
      name: createGroupDto.name,
      description: createGroupDto.description,
      profileImg: createGroupDto.profile_img,
      bannerImg: createGroupDto.banner_img,
      userId,
    })
    await GroupsUsers.create({ userId, groupId: data.id })
    return data
  }

  updateGroup = async (updateGroupDto, groupId, userId) => {
    await this.#checkGroupExistAndIsGroupAdmin(groupId, userId)

    const newUpdateGroupDto = Object.keys(updateGroupDto).reduce((acc, key) => {
      acc[snakeToCamel(key)] = updateGroupDto[key]
      return acc
    }, {})

    const group = await this.update(groupId, newUpdateGroupDto)
    return group
  }

  getGroup = async (groupId, currUserId) => {
    if (!groupId)
      throw ono({
        status: 400,
        message: 'Invalid group id.',
      })

    const data = await this.getById(groupId)
    if (!data)
      throw ono({
        status: 400,
        message: 'Invalid group id.',
      })

    const { count } = await GroupsUsers.findAndCountAll({ where: { userId: currUserId, groupId, isActive: true } })
    data.dataValues.isMember = count > 0

    data.dataValues.isAdmin = currUserId === data.dataValues.userId

    return data
  }

  getAllGroupsOfCurrentUser = async (currUserId) => {
    let { rows } = await this.model.findAndCountAll({
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('GroupsStatuses.id')), 'posts_count'],
          [Sequelize.fn('COUNT', Sequelize.col('GroupsUsers.id')), 'users_count'],
        ],
      },
      include: [
        {
          model: GroupsUsers,
          attributes: [],
          where: {
            userId: currUserId,
            isActive: true,
          },
        },
        {
          model: GroupsStatuses,
          attributes: [],
        },
      ],
      group: ['Group.id'],
    })

    if (!rows) return []
    rows = rows.map((row) => {
      if (row.userId === currUserId) {
        row.dataValues = { ...row.dataValues, isAdmin: true }
      }
      return row
    })
    return rows
  }

  deleteGroup = async (groupId, currUserId) => {
    await this.#checkGroupExistAndIsGroupAdmin(groupId, currUserId)
    await GroupsUsers.destroy({ where: { groupId } })
    await GroupsStatuses.destroy({ where: { groupId } })
    await this.model.destroy({ where: { id: groupId } })
    const result = await this.query({ where: { id: groupId } })

    return result
  }

  // GROUP MEMEBER METHODS

  getGroupMembers = async (groupId, currUser) => {
    await this.#checkGroupExistAndIsGroupAdmin(groupId, currUser.id)
    const userMastodonIds = await Users.findAll({
      include: [
        {
          model: GroupsUsers,
          attributes: [],
          where: {
            groupId,
            isActive: true,
          },
        },
      ],
      attributes: ['id', 'mastodon_id'],
      raw: true,
    })
    const mastodonUserIdRedUserIdObj = userMastodonIds.reduce((acc, curr) => {
      acc[curr.mastodon_id] = curr.id
      return acc
    }, {})

    let mastodonAccounts = await getMastodonUsersAccountDetails(mastodonUserIdRedUserIdObj, currUser.email)
    mastodonAccounts = mastodonAccounts.map((ma) => {
      if (ma.id === currUser.id) ma['is_admin'] = true
      return ma
    })
    return mastodonAccounts
  }

  joinGroup = async (groupId, currUserId) => {
    await this.#checkGroupExist(groupId)
    const { count } = await GroupsUsers.findAndCountAll({ where: { userId: currUserId, groupId, isActive: true } })
    if (count > 0)
      throw ono({
        status: 400,
        message: 'User is already member of the group.',
      })
    const result = await GroupsUsers.create({ groupId, userId: currUserId })
    return result
  }

  leaveGroup = async (groupId, currUserId) => {
    await this.#checkGroupExist(groupId)
    await this.#checkUserIsGropMember(groupId, currUserId)

    const record = await this.getById(groupId)
    if (record && record.dataValues.userId === currUserId)
      throw ono({
        status: 400,
        message: 'Cannot remove admin of the group.',
      })
    const result = await GroupsUsers.update({ isActive: false }, { where: { groupId, userId: currUserId } })
    return !!result ? { group_id: groupId } : null
  }

  removeGroupMember = async (memberId, groupId, currUserId) => {
    await this.#checkGroupExistAndIsGroupAdmin(groupId, currUserId)
    if (memberId == currUserId)
      throw ono({
        status: 400,
        message: 'Can not remove admin.',
      })

    const result = await GroupsUsers.update({ isActive: false }, { where: { groupId, userId: memberId } })
    return result
  }

  // GROUP STATUSES

  addGroupStatus = async (groupId, user, body) => {
    await this.#checkUserIsGropMember(groupId, user.id)
    body.spoiler_text = 'group'
    let result = await makeMastodonApiCall({ email: user.email, body, api: MASTODON_API.CREATE_STATUS })
    await GroupsStatuses.create({ statusId: result.id, groupId, userId: user.id })
    return result
  }

  editGroupStatus = async (groupId, user, body, id) => {
    await this.#checkUserIsGropMember(groupId, user.id)
    let result = await makeMastodonApiCall({ email: user.email, body, api: MASTODON_API.CREATE_STATUS, id })
    return result
  }

  getGroupStatuses = async (user, groupId) => {
    const { rows } = await GroupsStatuses.findAndCountAll({
      where: { groupId, isHidden: false },
      attributes: ['statusId'],
    })
    const statusIds = rows.map((row) => row.dataValues.statusId)
    const statuses = await getStatusesByIds(user.email, statusIds)
    return statuses
  }

  deleteGroupStatus = async (groupId, statusId, currUserId) => {
    await this.#checkGroupExistAndIsGroupAdmin(groupId, currUserId)

    const record = await GroupsStatuses.findOne({ where: { statusId, groupId } })

    if (!record)
      throw ono({
        status: 400,
        message: 'Status not found.',
      })

    const data = await deleteStatusById(statusId)
    if (!data) throw ono({ status: 400, message: 'Status not found.' })

    return await record.destroy()
  }

  toggleHideGroupStatus = async (groupId, statusId, currUserId) => {
    await this.#checkGroupExistAndIsGroupAdmin(groupId, currUserId)
    const record = await GroupsStatuses.findOne({
      where: { statusId, groupId },
    })

    if (!record)
      throw ono({
        status: 400,
        message: 'Status not found.',
      })

    await record.update({
      isHidden: !record.dataValues.isHidden,
    })
    return record
  }

  addVisitToGroup = async (groupId) => {
    const record = await this.getById(groupId)
    await this.#checkGroupExist(groupId)

    await record.update({
      viewCount: Number(record.dataValues.viewCount) + 1,
    })
    return record
  }

  searchGroups = async (searchString) => {
    searchString = searchString.toLowerCase()
    const result = await Group.findAndCountAll({
      where: {
        name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + searchString + '%'),
      },
    })
    return result
  }

  #checkUserIsGropMember = async (groupId, currUserId) => {
    const { count } = await GroupsUsers.findAndCountAll({ where: { userId: currUserId, groupId, isActive: true } })

    if (count === 0)
      throw ono({
        status: 400,
        message: 'User is not member of the group.',
      })
    return true
  }

  #checkGroupExistAndIsGroupAdmin = async (groupId, currUserId) => {
    const group = await this.#checkGroupExist(groupId)
    return this.#checkUserIsGroupAdmin(group, currUserId)
  }

  #checkGroupExist = async (groupId) => {
    const group = await this.getById(groupId)
    if (!group)
      throw ono({
        status: 400,
        message: 'Invalid group id.',
      })
    return group
  }

  #checkUserIsGroupAdmin = (group, currUserId) => {
    const { userId } = group.dataValues

    if (userId !== currUserId)
      throw ono({
        status: 400,
        message: 'User is not admin of the group.',
      })
    return group
  }
}

module.exports = new GroupRepository(Group)
