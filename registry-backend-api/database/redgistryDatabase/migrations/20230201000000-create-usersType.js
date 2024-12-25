'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UsersTypes', {
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_type: { type: Sequelize.STRING },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UsersTypes')
  },
}
