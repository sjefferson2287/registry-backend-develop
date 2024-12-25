'use strict'
const { Model } = require('sequelize')
const { camelToSnake } = require('../../../src/common/utils')

module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.University, {
        through: models.UniversityMajor,
        foreignKey: 'major_id',
        as: 'universities',
      })
    }

    toJSON() {
      const values = Object.assign({}, this.get())
      return camelToSnake(values)
    }
  }
  Major.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        field: 'name',
        allowNull: false,
        unique: {
          msg: 'Major name is already in use!',
        },
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
      tableName: 'major',
    },
  )
  return Major
}
