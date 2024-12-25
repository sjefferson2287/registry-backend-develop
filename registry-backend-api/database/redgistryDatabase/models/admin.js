'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      is_email_verified: DataTypes.BOOLEAN,
      email_verify_token: DataTypes.STRING,
      auth0_user_id: DataTypes.STRING,
      company_name: DataTypes.STRING,
      company_email_address: DataTypes.STRING,
      company_phone_number: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Admin',
    },
  )
  ;(async () => {
    await sequelize.sync()
  })()

  return Admin
}
