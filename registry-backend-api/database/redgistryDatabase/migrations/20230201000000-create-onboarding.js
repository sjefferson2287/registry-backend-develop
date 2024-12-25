'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Onboardings', {
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: { type: Sequelize.INTEGER },
      user_type: { type: Sequelize.INTEGER },
      first_name: { type: Sequelize.STRING },
      last_name: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      zip_code: { type: Sequelize.STRING },
      child_first_name: { type: Sequelize.STRING },
      child_last_name: { type: Sequelize.STRING },
      child_email: { type: Sequelize.STRING },
      school_name: { type: Sequelize.STRING },
      graduation_year: { type: Sequelize.INTEGER },
      over_13: { type: Sequelize.BOOLEAN },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Onboardings')
  },
}
