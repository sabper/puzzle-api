'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const routerApi = require('./router/api')
const logger = require('winston')
const helmet = require('helmet')
const path = require('path')

const app = express()

app.use(helmet())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

morgan.token('req-body', (req, res) => {
  if (req.body.password) {
    req.body.password = ''
  }
  return '\n "Request-Body" : ' + JSON.stringify(req.body, null, '\t')
})
app.use(morgan('[:date[iso]] :method :status :url HTTP/:http-version :user-agent [time :response-time ms] :req-body', {
  'stream': logger.stream
}))

// router 설정
app.use('/api/v1', routerApi) // /api/v1 하위로 요청되는 request 다음 router에서 수행

// swagger-ui
app.use('/swagger-ui', express.static(path.join(__dirname, '../swagger/ui')))
app.use('/swagger.json', (req, res) => {
  res.json(require('../swagger/swagger.json'))
})

const logErrors = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  logger.error(err.stack)
}

app.use(logErrors)

module.exports = app
