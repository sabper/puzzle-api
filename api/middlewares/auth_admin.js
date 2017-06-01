'user strict'

const logger = require('winston')
const config = require('../../config')
const User = require('../../model/mongo/user')
const _ = require('lodash')

/**
 * 관리자 사용자인지 확인
 * 해당 미들웨어는 토큰 검증 후 수행해야 함
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verifyAdmin = (req, res, next) => {
  const adminId = req.decoded.admin_id

  const checkAdminUser = () => {
    return new Promise((resolve, reject) => {
      User.findOne({admin_id: adminId}, (err, user) => {
        if (err) {
          reject(err)
        }

        if (_.isEmpty) {
          reject({
            code: 'user.amdin_info_not_exists',
            message: config.message.user.amdin_info_not_exists
          })
        }

        if (!user.is_admin) {
          reject({
            code: 'user.not_admin_user',
            message: config.message.user.not_admin_user
          })
        }

        resolve()
      })
    })
  }

  checkAdminUser()
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

module.exports = verifyAdmin
