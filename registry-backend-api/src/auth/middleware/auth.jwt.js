const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const authRepo = require('../../auth/repository/auth.repository')
module.exports = {
  async signJWT(data) {
    return await jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    })
  },

  async verifyToken(token) {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET)
      return decoded
    } catch (err) {
      return false
    }
  },

  async verifyJwt(req, res, next) {
    try {
      const decoded = await jwt_decode(req.token)
      let auth0Id = decoded.sub

      auth0Id = auth0Id.substring(6)
      let existingUser = await authRepo.getRedgistryUserByAuth0Id(auth0Id)

      if (!existingUser) {
        return 'unauthorize'
      }
      req.user = existingUser
    } catch (err) {
      return false
    }
  },
}
