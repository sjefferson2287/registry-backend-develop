const BaseDto = require('../../common/dto/base.dto')

class AuthDto extends BaseDto {
  constructor(model) {
    super(model)
  }

  createUser(body) {
    return {
      email: body.email,
      password: body.password,
      device_id: body.device_id,
      login_with: body.login_with,
    }
  }

  loginUser(body) {
    return {
      email: body.email,
      password: body.password,
      device_id: body.device_id,
    }
  }

  sendVerificationMail(body) {
    return {
      id: body.id,
    }
  }
  verifyUser(body) {
    return {
      token: body.token,
    }
  }
  roleCreateDto(body) {
    return {
      roleName: body.roleName,
      roleDescription: body.roleDescription,
    }
  }
  roleResourceDto(body) {
    return {
      resource_id: body.resource_id,
      role_id: body.role_id,
      can_add: body.can_add,
      can_edit: body.can_edit,
      can_view: body.can_view,
    }
  }
  resourceDto(body) {
    return {
      resourceName: body.resourceName,
      resourceDescription: body.resourceDescription,
    }
  }

  changeUserPassword(body) {
    return {
      password: body.password,
      confirmPassword: body.confirmPassword,
      oldPassword: body.oldPassword,
    }
  }
}

module.exports = new AuthDto()
