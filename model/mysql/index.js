'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(module.filename)
const config = require('../../config')
const logger = require('winston')
const db = {}

const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, config.mysql)

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

sequelize
  .authenticate()
  .then(() => {
    logger.info('MYSQL Connection has been established successfully.')
  })
  .catch((err) => {
    console.info('MYSQL Unable to connect to the database:', err)
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

// Import Models such that I can use them in the api just by importing 'db'
db.user = require('./user')(sequelize, Sequelize)

module.exports = db
