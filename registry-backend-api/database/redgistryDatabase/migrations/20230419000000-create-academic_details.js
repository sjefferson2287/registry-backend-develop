'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('academic_details', {
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: { type: Sequelize.INTEGER },
      school_name: { type: Sequelize.STRING },
      school_start: { type: Sequelize.STRING },
      school_consideration: { type: Sequelize.STRING },
      graduation_year: { type: Sequelize.DATE },
      gpa: { type: Sequelize.DECIMAL(11, 2) },
      majors: { type: Sequelize.ARRAY(Sequelize.STRING) },
      extra_curricular: { type: Sequelize.STRING },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('academic_details')
  },
}
