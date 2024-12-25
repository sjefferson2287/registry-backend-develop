'use strict'
const { Model } = require('sequelize')
const { camelToSnake } = require('../../../src/common/utils')

module.exports = (sequelize, DataTypes) => {
  class UniversityFollower extends Model {
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
  UniversityFollower.init(
    {
      universityId: {
        //pk of unviersity table
        type: DataTypes.INTEGER,
        field: 'university_id',
        primaryKey: true,
        allowNull: false,
      },
      followerId: {
        //pk of user table
        type: DataTypes.INTEGER,
        field: 'follower_id',
        primaryKey: true,
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
      tableName: 'university_follower',
    },
  )
  return UniversityFollower
}
