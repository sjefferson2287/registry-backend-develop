'use strict'
const Joi = require('joi')
const errorResponse = require('../../shared/lib/errorResponse')

module.exports.validateStudentOnboardingRequest = async (event, context, callback) => {
  const schema = Joi.object({
    user_type: Joi.number().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    zip_code: Joi.string().optional().allow(null),
    school: Joi.string().required(),
    graduation_year: Joi.number().required(),
    email: Joi.string().email().optional(),
    over_13: Joi.boolean().required(),
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

module.exports.validateParentOnboardingRequest = async (event, context, callback) => {
  const schema = Joi.object({
    onboard_via: Joi.string().valid('web', 'mobile').required(),
    user_type: Joi.number().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    zip_code: Joi.string().optional().allow(null),
    child: Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().required(),
      school: Joi.string().required(),
      graduation_year: Joi.number().required(),
    }),
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

module.exports.getInvitedUserDetailRequest = async (event, context, callback) => {
  const schemaQuery = Joi.object({
    email: Joi.string().required(),
  })
  let validation = schemaQuery.validate(event.queryStringParameters)
  if (validation.error) {
    context.end()
    const errors = []
    validation.error.details.map((validateError) => {
      return errors.push(validateError.message.replace(/[&<>"'`=\/]/g, ''))
    })
    return errorResponse.json(errors, 'Validation Error')
  }
}
