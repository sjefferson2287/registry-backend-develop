'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Onboardings', 'cover_picture', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Onboardings', 'profile_picture', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Onboardings', 'phone_number', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Onboardings', 'gender', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Onboardings', 'dob', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Onboardings', 'languages_known', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Onboardings', 'personal_website', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Onboardings', 'about', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Onboardings', 'address', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Onboardings', 'current_accadamic_status', {
        type: Sequelize.BLOB,
      }),
      queryInterface.addColumn('Onboardings', 'extra_curricular', {
        type: Sequelize.BLOB,
      }),
      queryInterface.addColumn('Onboardings', 'accadamic_intrests', {
        type: Sequelize.BLOB,
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
      queryInterface.removeColumn('Onboardings', 'cover_picture'),
      queryInterface.removeColumn('Onboardings', 'profile_picture'),
      queryInterface.removeColumn('Onboardings', 'phone_number'),
      queryInterface.removeColumn('Onboardings', 'dob'),
      queryInterface.removeColumn('Onboardings', 'languages_known'),
      queryInterface.removeColumn('Onboardings', 'personal_website'),
      queryInterface.removeColumn('Onboardings', 'about'),
      queryInterface.removeColumn('Onboardings', 'address'),
      queryInterface.removeColumn('Onboardings', 'current_accadamic_status'),
      queryInterface.removeColumn('Onboardings', 'extra_curricular'),
      queryInterface.removeColumn('Onboardings', 'accadamic_intrests'),
      queryInterface.removeColumn('Onboardings', 'gender'),
    ])
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}

// ALTER TABLE public."Onboardings" ALTER COLUMN current_accadamic_status TYPE bytea USING current_accadamic_status::bytea;
// ALTER TABLE public."Onboardings" ALTER COLUMN extra_curricular TYPE bytea USING extra_curricular::bytea;
// ALTER TABLE public."Onboardings" ALTER COLUMN accadamic_intrests TYPE bytea USING accadamic_intrests::bytea;
