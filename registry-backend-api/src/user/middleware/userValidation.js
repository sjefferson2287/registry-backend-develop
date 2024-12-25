'use strict'
const Joi = require('joi')
const errorResponse = require('../../shared/lib/errorResponse')

module.exports.validateUpdateStudentProfile = async (event, context, callback) => {
  const schema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    dob: Joi.string(),
    gender: Joi.string(),
    cover_picture: Joi.string(),
    profile_picture: Joi.string(),
    languages: Joi.array(),
    about_me: Joi.string(),
    joined: Joi.date(),
    ethnicity: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    zip: Joi.string(),
    siblings_details: Joi.array().items(
      Joi.object({
        siblings_details_id: Joi.number().required().allow(null, ''),
        name: Joi.string(),
        relationship: Joi.string(),
        email: Joi.string(),
      }).required(),
    ),
  })

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

module.exports.validateUpdateAccademicStatus = async (event, context, callback) => {
  const schema = Joi.object({
    school_name: Joi.string(),
    graduation_year: Joi.date(),
    gpa: Joi.number(),
    Extra_curricular: Joi.string(),
  })

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

module.exports.validateUpdateAccademicIntrests = async (event, context, callback) => {
  const schema = Joi.object({
    school_start: Joi.string(),
    school_consideration: Joi.string(),
    majors: Joi.array(),
  })

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
