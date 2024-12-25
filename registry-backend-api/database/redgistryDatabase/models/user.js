'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasOne(models.profiles, {
        foreignKey: 'user_id',
        as: 'profiles',
      })

      Users.hasMany(models.academic_details, {
        foreignKey: 'user_id',
        as: 'academic_details',
      })

      Users.hasMany(models.GroupsUsers, {
        foreignKey: 'user_id',
        onDelete: 'cascade',
      })

      Users.hasMany(models.UniversityFollower, {
        foreignKey: 'follower_id',
        onDelete: 'cascade',
      })

      Users.hasOne(models.Onboardings, {
        foreignKey: 'user_id',
        as: 'onboarding',
      })

      Users.hasMany(models.ParentChild, {
        foreignKey: 'parent_id',
        as: 'parents',
      })

      Users.hasMany(models.ParentChild, {
        foreignKey: 'child_id',
        as: 'children',
      })
    }
  }

  Users.init(
    {
      otp: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      password: {
        type: DataTypes.STRING,
        get() {
          return null
        },
      },
      mastodon_id: { type: DataTypes.STRING },
      auth0_user_id: { type: DataTypes.STRING },
      is_social: { type: DataTypes.BOOLEAN },
      is_account_verified: { type: DataTypes.BOOLEAN },
      is_password_verified: { type: DataTypes.BOOLEAN },
      createdAt: { field: 'created_at', type: DataTypes.DATE },
      updatedAt: { field: 'updated_at', type: DataTypes.DATE },
      otp_expiration: { field: 'otp_expiration', type: DataTypes.DATE },
    },
    {
      sequelize,
      tableName: 'Users',
      timestamps: true,
      underscored: true,
    },
  )

  return Users
}
