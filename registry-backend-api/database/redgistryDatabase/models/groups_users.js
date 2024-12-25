'use strict'
const { Model } = require('sequelize')
const { camelToSnake } = require('../../../src/common/utils')
module.exports = (sequelize, DataTypes) => {
  class GroupsUsers extends Model {
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
  GroupsUsers.init(
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
      isActive: {
        type: DataTypes.BOOLEAN,
        field: 'is_active',
      },
      joinedOn: {
        type: DataTypes.DATE,
        field: 'joined_on',
        defaultValue: DataTypes.NOW,
      },
      leftOn: {
        type: DataTypes.DATE,
        field: 'left_on',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'groups_users',
    },
  )
  return GroupsUsers
}
