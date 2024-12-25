const { tokenGenerator } = require('../../shared/lib/helper/twilio-chat')
const { sequelize } = require('../../../database/redgistryDatabase/models')

class TwilioRepository {
  constructor(model) {
    this.model = model
  }

  getTwilioAccessToken = (user) => {
    const tokenObj = tokenGenerator(user.id)
    return tokenObj
  }

  getUsersList = async (q) => {
    let [Result] = await sequelize.query(`
      SELECT 
        o.user_id, 
        p.profile_picture, 
        o.first_name, 
        o.last_name 
      FROM "Onboardings" o 
      LEFT JOIN profiles p ON o.user_id = p.user_id 
      WHERE (o.first_name || ' ' || o.last_name) LIKE '%${q}%';
    `)

    return Result
  }
}

module.exports = new TwilioRepository()
