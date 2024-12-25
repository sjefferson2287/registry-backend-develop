require('dotenv/config')

module.exports = {
  development: {
    username: 'postgres',
    password: 'WyPmWk8SWvws4ii',
    database: 'mastodon_production',
    host: 'mastodon-dev-1.cwzkal5s4eis.us-east-2.rds.amazonaws.com',
    dialect: 'postgres',
    logging: false,
  },
  test: {
    username: 'postgres',
    password: 'WyPmWk8SWvws4ii',
    database: 'mastodon_production',
    host: 'mastodon-dev-1.cwzkal5s4eis.us-east-2.rds.amazonaws.com',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: 'postgres',
    password: 'WyPmWk8SWvws4ii',
    database: 'mastodon_production',
    host: 'mastodon-dev-1.cwzkal5s4eis.us-east-2.rds.amazonaws.com',
    dialect: 'postgres',
    logging: false,
  },
}
