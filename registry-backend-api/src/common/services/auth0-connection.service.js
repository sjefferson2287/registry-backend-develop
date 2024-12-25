'use strict'
const axios = require('axios')
const ono = require('@jsdevtools/ono')

const refreshAccessToken = async (refreshToken) => {
  const auth0BaseUrl = process.env.AUTH0_API_BASE_URL
  const clientId = process.env.AUTH0_CLIENT_ID
  const clientSecret = process.env.AUTH0_CLIENT_SECRET
  try {
    const response = await axios.post(`${auth0BaseUrl}/oauth/token`, {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    })
    return response.data
  } catch (err) {
    throw ono({
      status: error.response && error.response.status ? error.response.status : 500,
      message:
        error.response && error.response.data ? error.response.data.error_description : 'Failed to fetch refresh token',
    })
  }
}

const getAccessToken = () => {
  var options = {
    method: 'POST',
    url: process.env.ISSUER_BASE_URL + '/oauth/token',
    headers: { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip,deflate,compress' },
    data: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_API_BASE_URL + '/api/v2/',
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
      throw ono({
        status: error.response && error.response.status ? error.response.status : 500,
        message:
          error.response && error.response.data
            ? error.response.data.error_description
            : 'Failed to fetch access token',
      })
    })
}

module.exports = {
  refreshAccessToken,
  getAccessToken,
}
