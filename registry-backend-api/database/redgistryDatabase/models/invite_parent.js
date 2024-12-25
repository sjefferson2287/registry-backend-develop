'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class InviteParent extends Model {
    static associate(models) {
      InviteParent.belongsTo(models.Users, {
        foreignKey: 'invitee_id',
        as: 'invitee',
      })
    }
  }

  InviteParent.init(
    {
      invitee_id: {
        type: DataTypes.INTEGER,
      },
      first_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      created_at: {
        field: 'created_at',
        type: DataTypes.DATE,
      },
      updated_at: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      tableName: 'invite_parent',
      modelName: 'InviteParent',
    },
  )

  return InviteParent
}
