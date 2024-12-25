'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Connection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Users, {
        foreignKey: 'id',
        onDelete: 'cascade',
        as: 'user',
      })
    }
  }
  Connection.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        allowNull: false,
        primaryKey: true,
      },
      connectionId: {
        type: DataTypes.INTEGER,
        field: 'connection_id',
        allowNull: false,
        primaryKey: true,
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
      tableName: 'connections',
    },
  )
  return Connection
}
