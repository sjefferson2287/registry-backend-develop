'use strict'

module.exports.json = (data, message = null) => {
  return {
    statusCode: 400,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      status: false,
      message,
      data,
    }),
  }
}
