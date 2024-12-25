const BaseService = require('../../common/services/base.service')
const redgistryModels = require('../../../database/redgistryDatabase/models')
const { sequelize, Sequelize } = require('../../../database/redgistryDatabase/models')
const { makeMastodonApiCall } = require('../../common/services/mastodon-apis.service')
const { MASTODON_API } = require('../../common/apiConstants')
const { default: ono } = require('@jsdevtools/ono')

const { Group, GroupsUsers, GroupsStatuses } = redgistryModels

class SearchRepository extends BaseService {
  constructor(model) {
    super(model)
    this.model = model
  }

  searchByQuery = async (queryParams, user) => {
    if (!queryParams?.q)
      throw ono({
        status: 400,
        message: 'Queryparam q is required.',
      })

    const searchString = queryParams.q.toLowerCase()

    let { rows } = await Group.findAndCountAll({
      where: {
        name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + searchString + '%'),
        isActive: true,
      },
      attributes: {
        include: [[Sequelize.fn('COUNT', Sequelize.col('GroupsStatuses.id')), 'posts_count']],
      },
      include: [
        {
          model: GroupsUsers,
          attributes: ['userId', 'isActive'],
          raw: true,
        },
        {
          model: GroupsStatuses,
          attributes: [],
        },
      ],
      group: ['Group.id', 'GroupsUsers.id', 'GroupsStatuses.id'],
    })

    const groups = rows.map((r) => {
      const users = r.GroupsUsers
      const isMember = users.filter((u) => u.userId === user.id && u.isActive === true).length > 0
      r.dataValues.is_member = isMember
      r.dataValues.member_count = users.length
      r.dataValues._groups_users = undefined
      return r
    })
    const result = await makeMastodonApiCall({ email: user.email, params: queryParams, api: MASTODON_API.SEARCH }) //searchByQueryAndToken(searchString, mastodonAccessToken)
    let statuses = await makeMastodonApiCall({ email: user.email, params: queryParams, api: MASTODON_API.TIMELINE }) //searchByQueryAndToken(searchString, mastodonAccessToken)
    statuses = statuses.filter((s) => s.content?.toLowerCase().includes(searchString))

    const finalResult = {
      ...result,
      groups,
      statuses,
    }

    return finalResult
  }
}

module.exports = new SearchRepository()
