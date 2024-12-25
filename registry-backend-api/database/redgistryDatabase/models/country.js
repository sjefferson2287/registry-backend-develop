'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Countries extends Model {
    static associate(models) {
      Countries.hasMany(models.States, {
        foreignKey: 'country_id',
        as: 'State',
      })
    }
  }

  Countries.init(
    {
      id: { primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4, type: DataTypes.UUID },
      name: { type: DataTypes.STRING },
      code: { type: DataTypes.STRING },
      is_active: { type: DataTypes.BOOLEAN },
    },
    {
      sequelize,
      timestamps: false,
      underscored: true,
      tableName: 'Countries',
    },
  )

  return Countries
}
