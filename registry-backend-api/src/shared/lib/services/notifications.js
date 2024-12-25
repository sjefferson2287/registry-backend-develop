'use strict'
const axios = require('axios')
const queueMicrotask = require('queue-microtask')
const postgresql = require('../../../shared/lib/postgresql')

const FIREBASE_API = process.env.FIREBASE_API
const DB_TABLE_SESSIONS = process.env.DB_TABLE_SESSIONS
const FIREBASE_SERVER_KEY = process.env.FIREBASE_SERVER_KEY

module.exports.pushNotification = async (users_ids, message_body) => {
  queueMicrotask(async () => {
    const receiversTokens = await this.getFcmTokensByUsersIds(`${users_ids}`)
    if (!receiversTokens) return

    const message = {
      registration_ids: receiversTokens,
      data: { url: message_body.redirect_url },
      notification: {
        title: message_body.title,
        body: message_body.body,
        sound: 'default',
        tag: 'tag',
        priority: 'high',
      },
    }

    axios({
      method: 'post',
      url: FIREBASE_API,
      data: JSON.stringify(message),
      headers: { Authorization: FIREBASE_SERVER_KEY, 'Content-Type': 'application/json' },
    })
      .then((result) => result)
      .catch((error) => error)
  })
}

module.exports.getFcmTokensByUsersIds = async (users_ids) => {
  const getSessionQuery = `SELECT * FROM "${DB_TABLE_SESSIONS}" WHERE user_id IN ('${users_ids.replace(
    /,/g,
    "', '",
  )}') AND firebase_token IS NOT NULL`
  const data = await postgresql.query(getSessionQuery)

  if (data.rows.length === 0) return null

  const receiversTokens = data.rows.map((element) => element.firebase_token)
  return receiversTokens
}
