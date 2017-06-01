'use strict'

const joi = require('joi')
const winston = require('winston')
const winstonAwsCloudWatch = require('winston-aws-cloudwatch')
const crypto = require('crypto')

let startTime = new Date().toDateString()
const NODE_ENV = process.env.NODE_ENV

const envVarsSchema = joi.object({
  LOGGER_LEVEL: joi.string()
    .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .default('info'),
  LOGGER_ENABLED: joi.boolean()
    .truthy('TRUE')
    .truthy('true')
    .falsy('FALSE')
    .falsy('false')
    .default(true)
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  logger: {
    level: envVars.LOGGER_LEVEL,
    enabled: envVars.LOGGER_ENABLED
  }
}

winston.level = config.logger.level

// stream property 정의. 해당 프로퍼티 호출하여 winston 으로 로깅 되지 않는 로그를 winston으로 기록한다. For morgan.
winston.stream = {
  write: (message, encoding) => {
    winston.info(message)
  }
}

winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
  'level': 'info',
  'timestamp': true,
  'colorize': true,
  'prettyPrint': true,
  'silent': false,
  'json': false
})

// cloudWatch 로 로그 전송
if (NODE_ENV === 'production') {
  let date = new Date().toISOString().split('T')[0]
  let name = crypto.createHash('md5').update(startTime).digest('hex')
  let streamName = `barogo-api-${process.env.PROCESS_TYPE}-${date}-${name}`

  winston.add(winstonAwsCloudWatch, {
    logGroupName: `barogo-api-${process.env.PROCESS_TYPE}`,
    logStreamName: streamName,
    createLogGroup: true,
    createLogStream: true,
    awsConfig: {
      region: 'ap-northeast-2'
    },
    formatLog: function (item) {
      return `${item.level} : ${item.message} ${JSON.stringify(item.meta)}`
    }
  })
}

if (!config.logger.enabled) {
  winston.remove(winston.transports.Console)
}

module.exports = config
