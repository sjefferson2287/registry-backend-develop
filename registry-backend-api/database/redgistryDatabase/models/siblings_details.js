'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class siblings_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      siblings_details.belongsTo(models.profiles, {
        foreignKey: 'profile_id',
        as: 'profiles',
      })
    }
  }
  siblings_details.init(
    {
      created_at: { field: 'created_at', type: DataTypes.DATE },
      updated_at: { field: 'updated_at', type: DataTypes.DATE },
      profile_id: { type: DataTypes.INTEGER },
      name: { type: DataTypes.STRING },
      relationship: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
    },
    {
      sequelize,
      timestamps: false,
    },
  )
  return siblings_details
}
