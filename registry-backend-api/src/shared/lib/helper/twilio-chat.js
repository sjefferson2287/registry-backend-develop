const Twilio = require('twilio')

const AccessToken = Twilio.jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant
const SyncGrant = AccessToken.SyncGrant

function tokenGenerator(identity) {
  if (!identity) return null

  const token = new AccessToken(
    process.env.TWILIO_CHAT_ACCOUNT_SID,
    process.env.TWILIO_CHAT_API_KEY,
    process.env.TWILIO_CHAT_API_SECRET,
    {
      identity: identity,
    },
  )
  const serviceSId = process.env.TWILIO_CHAT_SERVICE_SID
  if (serviceSId) {
    const chatGrant = new ChatGrant({
      serviceSid: serviceSId,
    })
    token.addGrant(chatGrant)
  }

  const syncServiceSid = process.env.TWILIO_CHAT_SYNC_SERVICE_SID
  if (syncServiceSid) {
    const syncGrant = new SyncGrant({
      serviceSid: syncServiceSid || 'default',
    })
    token.addGrant(syncGrant)
  }

  return {
    identity: token.identity,
    token: token.toJwt(),
  }
}

module.exports = { tokenGenerator }
