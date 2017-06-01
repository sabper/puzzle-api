'use strict'

const logger = require('winston')

// load .env in local development
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ silent: true })
}

// PROCESS_TYPE 에 해당하는 config 로드
const processType = process.env.PROCESS_TYPE

let config
try {
  config = require(`./${processType}`)
} catch (ex) {
  logger.error(ex)
  if (ex.code === 'MODULE_NOT_FOUND') {
    throw new Error(`No config for process type: ${processType}`)
  }

  throw ex
}

module.exports = config
