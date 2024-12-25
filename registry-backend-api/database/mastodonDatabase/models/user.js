'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasMany(models.oauth_access_tokens, {
        foreignKey: 'resource_owner_id',
        as: 'oauth_access_token',
      })

      users.belongsTo(models.accounts, {
        foreignKey: 'account_id',
        as: 'account',
      })
    }
  }
  users.init(
    {
      created_at: { field: 'created_at', type: DataTypes.DATE },
      updated_at: { field: 'updated_at', type: DataTypes.DATE },
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.BIGINT },
      account_id: { type: DataTypes.BIGINT },
      email: { type: DataTypes.STRING },
      approved: { type: DataTypes.BOOLEAN },
      confirmed_at: { type: DataTypes.DATE },
      encrypted_password: { type: DataTypes.STRING },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      underscored: true,
    },
  )

  return users
}
