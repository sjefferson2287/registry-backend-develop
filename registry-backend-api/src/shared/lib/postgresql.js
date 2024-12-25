const { Pool } = require('pg')

const dbconfig = {
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 5000,
}

const pool = new Pool(dbconfig)

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, _) => {
  console.error('Unexpected error on idle client', err)
})

pool.on('connect', () => {
  console.log('DB connection success!')
})
// pool.connect(() => {
//     console.log('DB connection success!');
// })

/**
 * PG Client Abstraction
 * @query() - Execute   Query
 */
const client = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}

module.exports = client
