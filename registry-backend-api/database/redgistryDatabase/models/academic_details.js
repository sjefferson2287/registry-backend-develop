'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class academic_details extends Model {
    static associate(models) {
      academic_details.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'Users',
      })
    }
  }
  academic_details.init(
    {
      created_at: { field: 'created_at', type: DataTypes.DATE },
      updated_at: { field: 'updated_at', type: DataTypes.DATE },
      user_id: { type: DataTypes.INTEGER },
      school_name: { type: DataTypes.STRING },
      school_start: { type: DataTypes.STRING },
      school_consideration: { type: DataTypes.STRING },
      graduation_year: { type: DataTypes.DATE },
      gpa: { type: DataTypes.DECIMAL(11, 2) },
      majors: { type: DataTypes.ARRAY(DataTypes.STRING) },
      extra_curricular: { type: DataTypes.STRING },
    },
    {
      sequelize,
      timestamps: false,
    },
  )
  return academic_details
}
