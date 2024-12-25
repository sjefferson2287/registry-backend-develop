'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class States extends Model {
    static associate(models) {
      States.belongsTo(models.Countries, {
        foreignKey: 'country_id',
        as: 'Country',
      })

      States.hasMany(models.cities, {
        foreignKey: 'state_id',
        as: 'citie',
      })
    }
  }

  States.init(
    {
      id: { primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4, type: DataTypes.UUID },
      country_id: { type: DataTypes.UUID },
      name: { type: DataTypes.STRING },
      code: { type: DataTypes.STRING },
    },
    {
      sequelize,
      timestamps: false,
      underscored: true,
      tableName: 'States',
    },
  )

  return States
}
