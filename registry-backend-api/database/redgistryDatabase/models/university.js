'use strict'
const { Model } = require('sequelize')
const { camelToSnake } = require('../../../src/common/utils')

module.exports = (sequelize, DataTypes) => {
  class University extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Major, {
        through: models.UniversityMajor,
        foreignKey: 'university_id',
        as: 'majors',
      })
      this.belongsToMany(models.CampusService, {
        through: models.UniversityCampusService,
        foreignKey: 'university_id',
        as: 'campus_services',
      })

      this.hasMany(models.UniversityFollower, {
        foreignKey: 'university_id',
        onDelete: 'cascade',
      })
    }

    toJSON() {
      const value = Object.assign({}, this.get())
      return camelToSnake(value)
    }
  }
  University.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        field: 'name',
        allowNull: false,
        unique: {
          msg: 'Group name is already in use!',
        },
      },
      description: {
        type: DataTypes.STRING,
        field: 'description',
      },
      website_link: {
        type: DataTypes.STRING,
        field: 'website_link',
      },
      address: {
        type: DataTypes.STRING,
        field: 'address',
      },
      category: {
        type: DataTypes.STRING,
        field: 'category',
      },
      profileImg: {
        type: DataTypes.BLOB,
        field: 'profile_img',
      },
      bannerImg: {
        type: DataTypes.BLOB,
        field: 'banner_img',
      },
      state: {
        type: DataTypes.STRING,
        field: 'state',
      },
      city: {
        type: DataTypes.STRING,
        field: 'city',
      },
      email: {
        type: DataTypes.STRING,
        field: 'email',
      },
      phoneNumber: {
        type: DataTypes.STRING,
        field: 'phone_number',
      },
      contactPerson: {
        type: DataTypes.STRING,
        field: 'contact_person',
      },
      contactPersonDesignation: {
        type: DataTypes.STRING,
        field: 'contact_person_designation',
      },
      contactPersonEmail: {
        type: DataTypes.STRING,
        field: 'contact_person_email',
      },
      levelOfInstitution: {
        type: DataTypes.STRING,
        field: 'level_of_institution',
      },
      institutionType: {
        type: DataTypes.STRING,
        field: 'institution_type',
      },
      campusSetting: {
        type: DataTypes.STRING,
        field: 'campus_setting',
      },
      studentBodySize: {
        type: DataTypes.STRING,
        field: 'student_body_size',
      },
      sportsSetup: {
        type: DataTypes.STRING,
        field: 'sports_setup',
      },
      otherActivities: {
        type: DataTypes.STRING,
        field: 'other_activities',
      },
      disabilitySupportServices: {
        type: DataTypes.STRING,
        field: 'disability_support_services',
      },
      financialAid: {
        type: DataTypes.STRING,
        field: 'financial_aid',
      },
      professors: {
        type: DataTypes.STRING,
        field: 'professors',
      },
      howToApply: {
        type: DataTypes.STRING,
        field: 'how_to_apply',
      },
      satRange: {
        type: DataTypes.STRING,
        field: 'sat_range',
      },
      actRange: {
        type: DataTypes.STRING,
        field: 'act_range',
      },
      collegeFees: {
        type: DataTypes.STRING,
        field: 'college_fees',
      },
      highSchoolGpa: {
        type: DataTypes.STRING,
        field: 'high_school_gpa',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'university',
    },
  )
  return University
}

// insert into university
// (name,profile_img , banner_img , description , state , city , email ,
// phone_number , contact_person , contact_person_designation , contact_person_email ,
// level_of_institution,institution_type , campus_setting, student_body_size, sports_setup, other_activities, disability_support_services,
// financial_aid, professors, how_to_apply, sat_range, act_range, college_fees, high_school_gpa)
// values
// ('Northwestern University','base64://asdf', 'base64://sad', 'university desc', 'Illinois', 'EVANSTON', 'admission@northwestern.edu',
// '999999999', 'Mark David', 'Admission officer', 'mark@xyz.com',
//  '4', 'Private or Public', 'Freshmen Live On-Campus', '8,438', '', 'Dance, Literary Magazine etc', 'NA',
//  '$51,087 / year', 'A+', 'https://www.northwestern.edu/admissions/', '1470-1570', '34-35', 'NA', 'Recommended')

// insert into major (name) values ('Economics'), ('Digital Communication'), ('Media/Multimedia'), ('Psychology'),('Biology')

// insert into university_major (university_id , major_id) values (1,1), (1, 2), (1,3), (1,4)

// insert into campus_service (name) values ('onCampusHousingAvailable'), ('freshmenRequiredToLiveOnCampus'), ('freshmenLiveOnCampusPercentage'), ('undergradsInCollegeHousingPercentage')

// insert into university_campus_service (university_id, campus_service_id, value) values (1, 1, 'true'), (1, 2, '80%'), (1, 3, '60%'), (1, 4, '90%')
