const BaseService = require('../../common/services/base.service')
const redgistryModels = require('../../../database/redgistryDatabase/models')
const { default: ono } = require('@jsdevtools/ono')
const { Connection, ConnectionRequest } = redgistryModels
const { Op } = require('sequelize')

class ConnectionsRepository extends BaseService {
  connect = async (currUserId, connectionId) => {
    if (currUserId == connectionId)
      throw ono({
        status: 400,
        message: 'Action canot be performed. Same user is requested',
      })

    const alreadyRequestedByOtherUser = await ConnectionRequest.findOne({
      where: { userId: connectionId, connectionId: currUserId },
    })

    if (alreadyRequestedByOtherUser)
      throw ono({
        status: 400,
        message: 'Action canot be performed. Other user already requested',
      })

    const data = await ConnectionRequest.create({
      userId: currUserId,
      connectionId,
    })
    return data
  }

  acceptConnection = async (currUserId, connectionId) => {
    const alreadyRequestedByThisUser = await ConnectionRequest.findOne({
      where: { userId: currUserId, connectionId, status: 'PENDING' },
    })

    if (alreadyRequestedByThisUser)
      throw ono({
        status: 400,
        message: 'Action canot be performed. You already requested for this user.',
      })

    const connectionToUpdate = await ConnectionRequest.findOne({
      where: { userId: connectionId, connectionId: currUserId, status: 'PENDING' },
    })

    if (connectionToUpdate) {
      const connections = await Connection.create({
        userId: currUserId,
        connectionId: connectionId,
      })

      if (connections) {
        await connectionToUpdate.destroy()
        return 'Connection Accepted'
      }
      throw ono({
        status: 500,
        message: 'Failed to create connection',
      })
    }
    throw ono({
      status: 400,
      message: "Connection Request doesn't exist",
    })
  }

  declineConnection = async (currUserId, connectionId) => {
    // decline can be done by both users from both sides
    const connectionToUpdate = await ConnectionRequest.findOne({
      where: {
        [Op.or]: [
          { connectionId: currUserId, userId: connectionId, status: 'PENDING' },
          { connectionId: connectionId, userId: currUserId, status: 'PENDING' },
        ],
      },
    })

    if (connectionToUpdate) {
      await connectionToUpdate.destroy()
      return 'Declined request successfully.'
    }
    throw ono({
      status: 400,
      message: "Connection Request doesn't exist",
    })
  }
}

module.exports = new ConnectionsRepository()
