'use strict'
const axios = require('axios').default
const baseUrl = process.env.API_BASE_URL
const headers = require('./helper/axios-headers')

module.exports.create = async (event, body) => {
  return axios
    .post(baseUrl + '/connections', body, {
      headers: headers.baseHeaders(event),
    })
    .then((result) => {
      return result.data
    })
    .catch((error) => {
      return {
        status: error && error.status ? error.status : 500,
        message: error.data.message,
      }
    })
}

module.exports.list = async (event, query) => {
  return axios
    .get(baseUrl + '/connections?strategy[0]=' + query.strategy, {
      headers: headers.baseHeaders(event),
    })
    .then((result) => {
      return result.data[0]
    })
    .catch((error) => {
      return {
        status: error && error.status ? error.status : 500,
        message: error.data.message,
      }
    })
}

module.exports.delete = async (event, id) => {
  return axios
    .delete(baseUrl + '/connections/' + id, {
      headers: headers.baseHeaders(event),
    })
    .then((result) => {
      return result.data
    })
    .catch((error) => {
      throw ono({
        status: error && error.status ? error.status : 500,
        message: error.data.message,
      })
    })
}

module.exports.oauth = async () => {
  const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID
  const AUTH0_CLIENT_PUBLIC_KEY = process.env.SECRET

  var options = {
    method: 'POST',
    url: process.env.ISSUER_BASE_URL + '/oauth/token',
    headers: { 'content-type': 'application/json' },
    data: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_PUBLIC_KEY,
      audience: `${process.env.API_BASE_URL}/`,
    }),
  }

  return axios
    .request(options)
    .then((result) => {
      return {
        status: result.status,
        data: result.data,
      }
    })
    .catch((error) => {
      return {
        status: error && error.status ? error.status : 500,
        message: error.response.data.error_description,
      }
    })
}
