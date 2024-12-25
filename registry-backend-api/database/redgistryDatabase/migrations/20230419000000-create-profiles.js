'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('profiles', {
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: { type: Sequelize.INTEGER },
      first_name: { type: Sequelize.STRING },
      last_name: { type: Sequelize.STRING },
      dob: { type: Sequelize.STRING },
      gender: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      zip_code: { type: Sequelize.STRING },
      languages: { type: Sequelize.ARRAY(Sequelize.STRING) },
      ethnicity: { type: Sequelize.STRING },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('profiles')
  },
}
