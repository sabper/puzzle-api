'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  MYSQL_URI: joi.string()
    .required()
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  mysql: {
    uri: envVars.MYSQL_URI,
    username: envVars.MYSQL_USER_NAME,
    password: envVars.MYSQL_PASSWORD,
    database: envVars.MYSQL_DATABASE,
    dialect: 'mysql'
  }
}

module.exports = config
