'use strict'

const promisify = require('es6-promisify')
const logger = require('winston')
const config = require('../config')
const app = require('./server')
require('./db')

const serverListen = promisify(app.listen, app)
serverListen(config.server.port)
  .then(() => logger.info(`App is listening on port ${config.server.port}`))
  .catch((err) => {
    logger.error('Error happened during server start', err)
    process.exit(1)
  })
