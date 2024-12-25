let userController = require('../user/controller/user.controller')
//let _ = require("lodash");
let jwt = require('../auth/middleware/auth.jwt')

module.exports.createRole = async (event, context, callback) => {
  try {
    let token = event.headers.Authorization
    let req = {
      token,
    }
    if (event.headers.Authorization) {
      await jwt.verifyJwt(req)
      // redgidtryValidate(userValidation.createRole),
      req.body = JSON.parse(event.body)

      let category = await userController.roleCreate(req)

      callback(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        },
        body: JSON.stringify(category),
      })
    } else {
      return callback('Unauthorized')
    }
  } catch (err) {
    callback(null, {
      statusCode: err.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      },
      body: err,
    })
  }
}

module.exports.updateRole = async (event, context, callback) => {
  try {
    let token = event.headers.Authorization
    let req = {
      token,
    }
    if (event.headers.Authorization) {
      await jwt.verifyJwt(req)

      req.body = JSON.parse(event.body)

      let category = await userController.updateUserRole(req)

      callback(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        },
        body: JSON.stringify(category),
      })
    } else {
      return 'unauthorized'
    }
  } catch (err) {
    callback(null, {
      statusCode: err.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      },
      body: err,
    })
  }
}

module.exports.updateProfile = async (event, context, callback) => {
  try {
    let token = event.headers.Authorization
    let req = {
      token,
    }
    if (event.headers.Authorization) {
      await jwt.verifyJwt(req)

      req.body = JSON.parse(event.body)
      let category = await userController.profileUpdate(req)

      callback(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        },
        body: JSON.stringify(category),
      })
    }
  } catch (err) {
    callback(null, {
      statusCode: err.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      },
      body: err,
    })
  }
}

module.exports.getRoles = async (event, context, callback) => {
  try {
    let token = event.headers.Authorization
    let req = {
      token,
    }
    if (event.headers.Authorization) {
      await jwt.verifyJwt(req)

      req.body = JSON.parse(event.body)
      let category = await userController.getRoles(req)
      console.log('testing working fine....', category)

      callback(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        },
        body: JSON.stringify(category),
      })
    } else {
      return 'unauthorized'
    }
  } catch (err) {
    callback(null, {
      statusCode: err.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      },
      body: err,
    })
  }
}
