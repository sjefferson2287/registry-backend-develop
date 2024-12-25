const Twilio = require('twilio')

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = new Twilio(accountSid, authToken)

module.exports.sendVerificationSMS = async (phoneTo, otp) => {
  const sentSMS = await client.messages.create({
    body: `Thank you for signing up, Enter this code ${otp} to confirm your email`,
    from: process.env.SENDER_PHONE,
    to: phoneTo,
  })

  return sentSMS
}

module.exports.sendChangePasswordSMS = async (phoneTo, otp) => {
  const sentSMS = await client.messages.create({
    body: `Thank you for verifying your account, Enter this code ${otp} to change your password`,
    from: process.env.SENDER_PHONE,
    to: phoneTo,
  })

  return sentSMS
}
