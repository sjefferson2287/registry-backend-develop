'use strict'
const Joi = require('joi')
const errorResponse = require('../../shared/lib/errorResponse')

module.exports.validateProfileRequest = async (event, context, callback) => {
  const studentSchema = Joi.object().keys({
    profile_img: Joi.string().allow(''),
    cover_img: Joi.string().allow(''),
    personal_information: Joi.object().keys({
      first_name: Joi.string().min(2).max(15).required(),
      last_name: Joi.string().min(2).max(15).required(),
      address: Joi.string().min(2).max(50).allow(''),
      state: Joi.string().allow(''),
      city: Joi.string().allow(''),
      zip_code: Joi.string().allow('').min(2).max(10),
      phone_number: Joi.string().allow(''),
      gender: Joi.string().allow(''),
      dob: Joi.string().allow(''),
      languages_known: Joi.array(),
      personal_website: Joi.string().allow(''),
      about: Joi.string().allow(''),
      ethnicity: Joi.string().allow(''),
    }),
    current_accadamic_status: Joi.object().keys({
      school_name: Joi.string().required(),
      graduation_year: Joi.string().required(),
      year_planning_to_attend_college: Joi.string().required(),
      gpa: Joi.string().allow(''),
      class_rank: Joi.string().allow(''),
      sat_act_score: Joi.string().allow(''),
      award_issuing_entity: Joi.string().allow(''),
      award_description: Joi.string().allow(''),
      award_received_date: Joi.string().allow(''),
      special_cource_entity_name: Joi.string().allow(''),
      special_cource_entity_location: Joi.string().allow(''),
      special_cource_description: Joi.string().allow(''),
      special_cource_completed_date: Joi.string().allow(''),
    }),
    extra_curricular: Joi.object().keys({
      work_company: Joi.string().allow(''),
      work_date: Joi.string().allow(''),
      work_position: Joi.string().allow(''),
      work_responsibility: Joi.string().allow(''),
      part_time_work_company: Joi.string().allow(''),
      part_time_work_date: Joi.string().allow(''),
      part_time_work_position: Joi.string().allow(''),
      part_time_work_responsibility: Joi.string().allow(''),
      sport_participation_name: Joi.string().allow(''),
      sport_participation_description: Joi.string().allow(''),
      sport_participation_recognition: Joi.string().allow(''),
      accadamic_club_entity: Joi.string().allow(''),
      accadamic_club_recognition: Joi.string().allow(''),
      accadamic_club_description: Joi.string().allow(''),
      artistic_field: Joi.string().allow(''),
      artistic_field_recognition: Joi.string().allow(''),
      artistic_field_description: Joi.string().allow(''),
      voluntieer_service_field: Joi.string().allow(''),
      voluntieer_service_recognition: Joi.string().allow(''),
      voluntieer_service_description: Joi.string().allow(''),
      internship_company: Joi.string().allow(''),
      internship_dates: Joi.string().allow(''),
      internship_position: Joi.string().allow(''),
      internship_responsibilities: Joi.string().allow(''),
      intrests_hobbies: Joi.string().allow(''),
    }),
    accadamic_intrests: Joi.object().keys({
      expected_clg_start: Joi.array(),
      colleges_considering: Joi.array(),
      majors: Joi.array(),
    }),
  })

  const parentSchema = Joi.object().keys({
    profile_img: Joi.string().allow(''),
    cover_img: Joi.string().allow(''),
    personal_information: Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      address: Joi.string().allow('').min(2).max(50),
      state: Joi.string().allow('').required(),
      city: Joi.string().allow('').required(),
      zip_code: Joi.string().allow(''),
      phone_number: Joi.string().allow(''),
      gender: Joi.string().allow(''),
      dob: Joi.string().allow(''),
      languages_known: Joi.array(),
      personal_website: Joi.string().allow(''),
      about: Joi.string().allow(''),
    }),
  })

  const { path } = event
  const schema = path === '/student-profile' ? studentSchema : parentSchema
  const validation = schema.validate(JSON.parse(event.body) || {})
  if (validation.error) {
    context.end()
    const errors = []
    validation.error.details.map((validateError) => {
      return errors.push(validateError.message.replace(/[&<>"'`=\/]/g, ''))
    })
    return errorResponse.json(errors, 'Validation Error')
  }
}
