'use strict'
const { Model } = require('sequelize')
const { decodeBase64, camelToSnake } = require('../../../src/common/utils')

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.GroupsStatuses, {
        foreignKey: 'group_id',
        onDelete: 'cascade',
      })
      this.hasMany(models.GroupsUsers, {
        foreignKey: 'group_id',
        onDelete: 'cascade',
      })
    }

    toJSON() {
      const values = Object.assign({}, this.get())
      return camelToSnake(values)
    }
  }
  Group.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        field: 'name',
        allowNull: false,
        validate: {
          notNull: { msg: 'Group name cannot be null!' },
          notEmpty: { msg: 'Group name cannot be empty!' },
        },
        unique: {
          msg: 'Group name is already in use!',
        },
      },
      description: {
        type: DataTypes.STRING,
        field: 'description',
      },
      profileImg: {
        type: DataTypes.BLOB,
        field: 'profile_img',
        get() {
          const data = this.getDataValue('profileImg')
          return data !== null && typeof data === 'object' ? decodeBase64(data) : ''
        },
      },
      bannerImg: {
        type: DataTypes.BLOB,
        field: 'banner_img',
        get() {
          const data = this.getDataValue('bannerImg')
          return data !== null && typeof data === 'object' ? decodeBase64(data) : ''
        },
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
      viewCount: {
        type: DataTypes.INTEGER,
        field: 'view_count',
        defaultValue: 0,
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
      tableName: 'groups',
    },
  )
  return Group
}
