'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class oauth_access_tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      oauth_access_tokens.belongsTo(models.users, {
        foreignKey: 'resource_owner_id',
        as: 'user',
      })
    }
  }

  oauth_access_tokens.init(
    {
      created_at: { field: 'created_at', type: DataTypes.DATE },
      last_used_at: { field: 'last_used_at', type: DataTypes.DATE },
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.BIGINT },
      resource_owner_id: { type: DataTypes.BIGINT },
      application_id: { type: DataTypes.BIGINT },
      scopes: { type: DataTypes.STRING },
      token: { type: DataTypes.STRING },
    },
    {
      sequelize,
      tableName: 'oauth_access_tokens',
      timestamps: false,
      underscored: true,
    },
  )

  return oauth_access_tokens
}
