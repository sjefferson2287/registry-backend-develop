'use strict'
const { Model } = require('sequelize')
const { camelToSnake } = require('../../../src/common/utils')
module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Role.hasOne(models.brand_user_role, {
      //   foreignKey: "role_id",
      // });
      // Role.hasOne(models.UserRole, {
      //   foreignKey: "role_id",
      // });
    }

    toJSON() {
      const values = Object.assign({}, this.get())
      return camelToSnake(values)
    }
  }
  UserRoles.init(
    {
      user_id: { type: DataTypes.INTEGER },
      role_id: { type: DataTypes.INTEGER },
      createdAt: {
        field: 'createdAt',
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: 'updatedAt',
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'UserRoles',
      timestamps: true,
      underscored: true,
    },
  )

  return UserRoles
}
