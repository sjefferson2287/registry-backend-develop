'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ConnectionRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the association between Connection and User for user_id
      // this.belongsTo(User, { foreignKey: 'user_id' })
      // // Define the association between Connection and User for connection_id
      // this.belongsTo(User, { foreignKey: 'connection_id' })
    }
  }
  ConnectionRequest.init(
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
      status: {
        type: DataTypes.STRING,
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
      tableName: 'connection_requests',
    },
  )
  return ConnectionRequest
}
