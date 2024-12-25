'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserSession extends Model {
    static associate(models) {
      // define association here
    }
  }
  UserSession.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mastodon_access_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      access_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      device_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'user_sessions',
      timestamps: true,
      underscored: true,
    },
  )
  return UserSession
}
