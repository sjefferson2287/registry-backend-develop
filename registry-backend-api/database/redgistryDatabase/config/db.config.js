require('dotenv/config')

module.exports = {
  development: {
    username: 'postgres',
    password: 'redgistry-dev',
    database: 'postgres',
    host: '52.206.80.247',
    dialect: 'postgres',
    logging: false,
  },
  test: {
    username: 'postgres',
    password: 'redgistry-dev',
    database: 'postgres',
    host: '52.206.80.247',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: 'postgres',
    password: 'redgistry-dev',
    database: 'postgres',
    host: '52.206.80.247',
    dialect: 'postgres',
    logging: false,
  },
}
