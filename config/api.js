'use strict'

const common = require('./components/common')
const logger = require('./components/logger')
const mongo = require('./components/mongo')
const redis = require('./components/redis')
const server = require('./components/server')
const message = require('./components/message')
const mysql = require('./components/mysql')

module.exports = Object.assign({}, common, logger, mongo, redis, server, message, mysql)
