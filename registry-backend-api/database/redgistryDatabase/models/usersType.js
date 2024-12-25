'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UsersTypes extends Model {
    static associate(models) {
      UsersTypes.hasOne(models.Onboardings, {
        foreignKey: 'user_type',
        as: 'Onboarding',
      })
    }
  }

  UsersTypes.init(
    {
      created_at: { field: 'created_at', type: DataTypes.DATE },
      updated_at: { field: 'updated_at', type: DataTypes.DATE },
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
      user_type: { type: DataTypes.STRING },
    },
    {
      sequelize,
      tableName: 'UsersTypes',
      timestamps: true,
      underscored: true,
    },
  )

  return UsersTypes
}
