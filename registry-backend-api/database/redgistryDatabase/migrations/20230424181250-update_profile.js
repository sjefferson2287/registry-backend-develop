'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('profiles', 'cover_picture', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('profiles', 'profile_picture', {
        type: Sequelize.STRING,
      }),
    ])
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('profiles', 'cover_picture'),
      queryInterface.removeColumn('profiles', 'profile_picture'),
    ])
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
