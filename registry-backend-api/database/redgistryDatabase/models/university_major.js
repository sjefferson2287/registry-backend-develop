'use strict'
const { Model } = require('sequelize')
const { camelToSnake } = require('../../../src/common/utils')

module.exports = (sequelize, DataTypes) => {
  class UniversityMajor extends Model {
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
  UniversityMajor.init(
    {
      universityId: {
        //pk of unviersity table
        type: DataTypes.INTEGER,
        field: 'university_id',
        allowNull: false,
      },
      majorId: {
        //pk of unviersity table
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
      tableName: 'university_major',
    },
  )
  return UniversityMajor
}
