'use strict'
const Joi = require('joi')
const errorResponse = require('../../shared/lib/errorResponse')

module.exports.validateUniversityRequest = async (event, context, callback) => {
  const universitySchema = Joi.object().keys({
    name: Joi.string().min(3),
  })

  const validation = universitySchema.validate(JSON.parse(event.body) || {})
  if (validation.error) {
    context.end()
    const errors = []
    validation.error.details.map((validateError) => {
      return errors.push(validateError.message.replace(/[&<>"'`=\/]/g, ''))
    })
    return errorResponse.json(errors, 'Validation Error')
  }
}
