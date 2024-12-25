'use strict'
const errorResponse = require('../../shared/lib/errorResponse')
const Joi = require('joi')

module.exports.createUserRequest = async (event, context, callback) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().when('is_social', {
      is: false,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    device_id: Joi.string().required(),
    is_social: Joi.string().required().valid(true, false),
    access_token: Joi.string().when('is_social', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    refresh_token: Joi.string().when('is_social', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    provider: Joi.string().when('is_social', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
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

module.exports.loginUserRequest = async (event, context, callback) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().when('is_social', {
      is: false,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    device_id: Joi.string().required(),
    is_social: Joi.string().required().valid(true, false),
    access_token: Joi.string().when('is_social', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    refresh_token: Joi.string().when('is_social', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    provider: Joi.string().when('is_social', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
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

module.exports.socialLoginUser = async (event, context, callback) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    device_id: Joi.string().required(),
    is_social: Joi.string().required().valid(true),
    access_token: Joi.string().required(),
    refresh_token: Joi.string().required(),
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

module.exports.sendAccountVerificationOTP = async (event, context, callback) => {
  const schema = Joi.object({
    login_with: Joi.string().valid('email', 'phone').required(),
    mode: Joi.string().required(),
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

module.exports.verifyAccountVerificationOTP = async (event, context, callback) => {
  const schema = Joi.object({
    // login_with: Joi.string().valid('email', 'phone').required(),
    otp: Joi.string().required(),
    mode: Joi.string().required(),
    is_social: Joi.boolean().optional(),
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

module.exports.sendChangePasswordOTP = async (event, context, callback) => {
  const schema = Joi.object({
    login_with: Joi.string().valid('email', 'phone').required(),
    mode: Joi.string().required(),
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

module.exports.verifyChangePasswordOTP = async (event, context, callback) => {
  const schema = Joi.object({
    login_with: Joi.string().valid('email', 'phone').required(),
    otp: Joi.string().required(),
    mode: Joi.string().required(),
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

module.exports.changePassword = async (event, context, callback) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
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
