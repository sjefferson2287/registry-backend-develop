'use strict'

const { NOW } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invite_children', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      invitee_id: {
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      school: {
        type: Sequelize.STRING,
      },
      graduation_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: NOW(),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: NOW(),
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invite_children')
  },
}
