'use strict'

const mongoose = require('mongoose')
const config = require('../config')
const logger = require('winston')

// connect mongodb
logger.info(config.mongo.uri)
mongoose.connect(config.mongo.uri)
mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error', () => {
  throw new Error(`
      mongodb not connected.
  `)
})
db.once('open', () => {
  logger.info('connected to mongodb server')
})

module.exports = db
