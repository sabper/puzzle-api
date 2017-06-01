'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  LANG_TYPE: joi.string()
    .allow(['ko', 'en'])
    .default('ko')
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = require(`../json/message_${envVars.LANG_TYPE}.json`)

module.exports = config
