'use string'

module.exports.baseHeaders = (event) => {
  return {
    Authorization: 'Bearer ' + event.data.access_token,
    'Content-Type': 'application/json',
  }
}
