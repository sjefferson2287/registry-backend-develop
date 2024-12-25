'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ParentChild extends Model {
    static associate(models) {
      ParentChild.belongsTo(models.Users, {
        foreignKey: 'parent_id',
        as: 'parent',
      })

      ParentChild.belongsTo(models.Users, {
        foreignKey: 'child_id',
        as: 'child',
      })
    }
  }

  ParentChild.init(
    {
      created_at: {
        field: 'created_at',
        type: DataTypes.DATE,
      },
      updated_at: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      parent_id: {
        type: DataTypes.INTEGER,
      },
      child_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      tableName: 'parent_child',
      modelName: 'ParentChild',
    },
  )

  return ParentChild
}
