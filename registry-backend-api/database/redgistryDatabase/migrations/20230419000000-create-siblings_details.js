'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('siblings_details', {
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      profile_id: { type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING },
      relationship: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('siblings_details')
  },
}
