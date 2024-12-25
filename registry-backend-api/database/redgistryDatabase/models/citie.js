'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class cities extends Model {
    static associate(models) {
      cities.belongsTo(models.States, {
        foreignKey: 'state_id',
        as: 'State',
      })
    }
  }

  cities.init(
    {
      id: { primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4, type: DataTypes.UUID },
      state_id: { type: DataTypes.UUID },
      name: { type: DataTypes.STRING },
      zipcode: { type: DataTypes.STRING },
      long: { type: DataTypes.DOUBLE },
      lat: { type: DataTypes.DOUBLE },
    },
    {
      sequelize,
      timestamps: false,
      underscored: true,
      tableName: 'cities',
    },
  )

  return cities
}
