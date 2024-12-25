'use strict'
const { Model } = require('sequelize')
const { camelToSnake } = require('../../../src/common/utils')
module.exports = (sequelize, DataTypes) => {
  class GroupsStatuses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    toJSON() {
      const values = Object.assign({}, this.get())
      return camelToSnake(values)
    }
  }
  GroupsStatuses.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      groupId: {
        //fk for group table
        type: DataTypes.INTEGER,
        field: 'group_id',
        allowNull: false,
      },
      userId: {
        //fk for user table
        type: DataTypes.INTEGER,
        field: 'user_id',
        allowNull: false,
      },
      statusId: {
        //pk of statuses table in mastodon
        type: DataTypes.INTEGER,
        field: 'status_id',
        allowNull: false,
        unique: {
          msg: 'Status already exist.',
        },
      },
      isHidden: {
        type: DataTypes.BOOLEAN,
        field: 'is_hidden',
      },
    },
    {
      sequelize,
      tableName: 'groups_statuses',
    },
  )
  return GroupsStatuses
}
