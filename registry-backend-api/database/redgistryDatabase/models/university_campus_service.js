'use strict'
const { Model } = require('sequelize')
const { camelToSnake } = require('../../../src/common/utils')

module.exports = (sequelize, DataTypes) => {
  class UniversityCampusService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}

    toJSON() {
      const values = Object.assign({}, this.get())
      return camelToSnake(values)
    }
  }
  UniversityCampusService.init(
    {
      universityId: {
        //pk of unviersity table
        type: DataTypes.INTEGER,
        field: 'university_id',
        allowNull: false,
      },
      campusServiceId: {
        //pk of major table
        type: DataTypes.INTEGER,
        field: 'campus_service_id',
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        field: 'value',
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
      tableName: 'university_campus_service',
    },
  )
  return UniversityCampusService
}
