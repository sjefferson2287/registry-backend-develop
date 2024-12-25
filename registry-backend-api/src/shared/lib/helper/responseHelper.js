'use strict'

module.exports.json = (callback, body = {}, status = 200, message = null) => {
  var responsedata = {
    status: status >= 200 && status < 300 ? true : false,
    message: message != null ? message : '',
    data: body != null ? (body.stack ? body.stack : body) : '',
  }
  return {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: responsedata != null ? JSON.stringify(responsedata) : '',
  }
}
