'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('major', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    // await queryInterface.createTable(
    //   'LevelOfInstitution',
    //   {
    //     id: {
    //       type: Sequelize.INTEGER,
    //       autoIncrement: true,
    //       primaryKey: true,
    //     },
    //     name: {
    //       type: Sequelize.STRING,
    //       allowNull: false,
    //       unique: true,
    //     },
    //   },
    //   {
    //     tableName: 'level_of_institution',
    //     timestamps: true,
    //     createdAt: 'created_at',
    //     updatedAt: 'updated_at',
    //   },
    // )
    await queryInterface.createTable('campus_service', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    await queryInterface.createTable('university', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      profile_img: {
        type: Sequelize.STRING,
      },
      banner_img: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      website_link: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      contact_person: {
        type: Sequelize.STRING,
      },
      contact_person_designation: {
        type: Sequelize.STRING,
      },
      contact_person_email: {
        type: Sequelize.STRING,
      },
      level_of_institution: {
        type: Sequelize.STRING,
      },
      institution_type: {
        type: Sequelize.STRING,
      },
      campus_setting: {
        type: Sequelize.STRING,
      },
      student_body_size: {
        type: Sequelize.STRING,
      },
      sports_setup: {
        type: Sequelize.STRING,
      },
      other_activities: {
        type: Sequelize.STRING,
      },
      disability_support_services: {
        type: Sequelize.STRING,
      },
      financial_aid: {
        type: Sequelize.STRING,
      },
      professors: {
        type: Sequelize.STRING,
      },
      how_to_apply: {
        type: Sequelize.STRING,
      },
      sat_range: {
        type: Sequelize.STRING,
      },
      act_range: {
        type: Sequelize.STRING,
      },
      college_fees: {
        type: Sequelize.STRING,
      },
      high_school_gpa: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    await queryInterface.createTable('university_major', {
      university_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'university',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      major_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'major',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    await queryInterface.createTable('university_follower', {
      university_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'university',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      follower_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    await queryInterface.createTable('university_campus_service', {
      university_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'university',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      campus_service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'campus_service',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      value: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    await queryInterface.sequelize.query(`
      ALTER TABLE university_major
      ADD CONSTRAINT university_major_unique
      UNIQUE (major_id, university_id);
    `)

    await queryInterface.sequelize.query(`
      ALTER TABLE university_campus_service
      ADD CONSTRAINT university_campus_service_unique
      UNIQUE (campus_service_id, university_id);
    `)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('major')
    await queryInterface.dropTable('campus_service')
    await queryInterface.dropTable('university')
    await queryInterface.dropTable('university_major')
    await queryInterface.dropTable('university_campus_service')
  },
}
