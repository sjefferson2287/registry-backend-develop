'use strict'
const moment = require('moment')
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Onboardings extends Model {
    static associate(models) {
      Onboardings.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'User',
      })

      Onboardings.belongsTo(models.UsersTypes, {
        foreignKey: 'user_type',
        as: 'UsersType',
      })

      Onboardings.belongsTo(models.cities, {
        foreignKey: 'city',
        as: 'city_detail',
      })

      Onboardings.belongsTo(models.States, {
        foreignKey: 'state',
        as: 'state_detail',
      })
    }
  }

  Onboardings.init(
    {
      created_at: { field: 'created_at', type: DataTypes.DATE },
      updated_at: { field: 'updated_at', type: DataTypes.DATE },
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
      user_id: { type: DataTypes.INTEGER },
      user_type: { type: DataTypes.INTEGER },
      first_name: { type: DataTypes.STRING },
      last_name: { type: DataTypes.STRING },
      state: { type: DataTypes.UUID },
      city: { type: DataTypes.UUID },
      zip_code: { type: DataTypes.STRING },
      over_13: { type: DataTypes.BOOLEAN },
      child_first_name: { type: DataTypes.STRING },
      child_last_name: { type: DataTypes.STRING },
      child_email: { type: DataTypes.STRING },
      school_name: { type: DataTypes.INTEGER },
      graduation_year: { type: DataTypes.INTEGER },

      about: { type: DataTypes.STRING },
      personal_website: { type: DataTypes.STRING },
      languages_known: {
        type: DataTypes.STRING,
        get() {
          const data = this.getDataValue('languages_known')
          return JSON.parse(data || '[]')
        },
      },
      dob: { type: DataTypes.STRING },
      gender: { type: DataTypes.STRING },
      phone_number: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      cover_picture: {
        type: DataTypes.BLOB,
        get() {
          const data = this.getDataValue('cover_picture')
          return data ? data.toString('utf8') : ''
        },
      },
      profile_picture: {
        type: DataTypes.BLOB,
        get() {
          const data = this.getDataValue('profile_picture')
          return data ? data.toString('utf8') : ''
        },
      },
      joined: {
        type: DataTypes.DATE,
        get() {
          const data = this.getDataValue('joined')
          return data ? moment(data).format('MM/DD/YYYY') : null
        },
      },
      ethnicity: { type: DataTypes.STRING },
      current_accadamic_status: { type: DataTypes.BLOB },
      extra_curricular: { type: DataTypes.BLOB },
      accadamic_intrests: { type: DataTypes.BLOB },
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      tableName: 'Onboardings',
    },
  )

  return Onboardings
}
