'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      profiles.hasMany(models.siblings_details, {
        foreignKey: 'profile_id',
        as: 'siblings_details',
      })

      profiles.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'Users',
      })
    }
  }
  profiles.init(
    {
      created_at: { field: 'created_at', type: DataTypes.DATE },
      updated_at: { field: 'updated_at', type: DataTypes.DATE },
      user_id: { type: DataTypes.INTEGER },
      first_name: { type: DataTypes.STRING },
      last_name: { type: DataTypes.STRING },
      dob: { type: DataTypes.STRING },
      gender: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      zip_code: { type: DataTypes.STRING },
      languages: { type: DataTypes.STRING },
      ethnicity: { type: DataTypes.STRING },
      cover_picture: { type: DataTypes.BLOB },
      profile_picture: { type: DataTypes.BLOB },
    },
    {
      sequelize,
      timestamps: false,
    },
  )
  return profiles
}
