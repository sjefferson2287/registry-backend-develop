'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      accounts.hasMany(models.users, {
        foreignKey: 'account_id',
        as: 'user',
      })
    }
  }
  accounts.init(
    {
      created_at: { field: 'created_at', type: DataTypes.DATE },
      updated_at: { field: 'updated_at', type: DataTypes.DATE },
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.BIGINT },
      username: { type: DataTypes.STRING },
    },
    {
      sequelize,
      tableName: 'accounts',
      timestamps: true,
      underscored: true,
    },
  )

  return accounts
}
