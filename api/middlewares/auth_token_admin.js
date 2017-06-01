'user strict'

const jwt = require('jsonwebtoken')
const logger = require('winston')
const config = require('../../config')

/**
 * token, admin 사용자인지 검증
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verifyAuthByTokenAdmin = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token

  const checkParam = () => {
    return new Promise((resolve, reject) => {
      if (!token) {
        reject({
          code: 'user.not_verify_token',
          message: config.message.user.not_verify_token
        })
      }

      resolve()
    })
  }

  const verifyToken = () => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.admin_token_secret_key, (err, decoded) => {
        if (err) {
          reject(err)
        }

        resolve(decoded)
      })
    })
  }

  const checkAdminUser = (decoded) => {
    return new Promise((resolve, reject) => {
      if (!decoded.admin) {
        reject({
          code: 'user.not_admin_user',
          message: config.message.user.not_admin_user
        })
      }

      resolve()
    })
  }

  checkParam()
  .then(verifyToken)
  .then(checkAdminUser)
  .then(() => {
    next()
  })
  .catch((err) => {
    let errCode = err.code || 'common.not_define_error'
    let errMsg = err.message || config.message.common.not_define_error

    logger.error(err)

    return res.status(403).json({
      code: errCode,
      message: errMsg
    })
  })
}

module.exports = verifyAuthByTokenAdmin
