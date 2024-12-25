'use strict'
const { Model } = require('sequelize')
const { camelToSnake } = require('../../../src/common/utils')

module.exports = (sequelize, DataTypes) => {
  class CampusService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.University, {
        through: models.UniversityCampusService,
        foreignKey: 'campus_service_id',
        as: 'campus_services',
      })
    }

    toJSON() {
      const value = Object.assign({}, this.get())
      return camelToSnake(value)
    }
  }
  CampusService.init(
    {
      universityId: {
        //pk of unviersity table
        type: DataTypes.INTEGER,
        field: 'university_id',
        allowNull: false,
      },
      majorId: {
        //pk of major table
        type: DataTypes.INTEGER,
        field: 'major_id',
        allowNull: false,
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
      tableName: 'campus_service',
    },
  )
  return CampusService
}
