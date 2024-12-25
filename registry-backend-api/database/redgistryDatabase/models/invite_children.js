'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class InviteChildren extends Model {
    static associate(models) {
      InviteChildren.belongsTo(models.Users, {
        foreignKey: 'invitee_id',
        as: 'invitee',
      })
    }
  }

  InviteChildren.init(
    {
      created_at: {
        field: 'created_at',
        type: DataTypes.DATE,
      },
      updated_at: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },
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
      school: {
        type: DataTypes.STRING,
      },

      graduation_year: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      tableName: 'invite_children',
      modelName: 'InviteChildren',
    },
  )

  return InviteChildren
}
