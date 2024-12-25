const parseLoginUser = (event) => {
  return event.requestContext?.authorizer || {}
}

const randomNumber = (min = 100000, max = 999999) => Math.floor(Math.random() * (max - min + 1)) + min

module.exports = {
  parseLoginUser,
  randomNumber,
}
