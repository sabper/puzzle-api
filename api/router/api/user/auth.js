'use strict'

const User = require('../../../../model/mongo/user')
const logger = require('winston')
const config = require('../../../../config')
const _ = require('lodash')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

/**
 * admin 사용자 생성
 */
exports.create = (req, res) => {
  const { email, password, name, phone } = req.body

  // parameter check
  const checkParam = () => {
    return new Promise((resolve, reject) => {
      if (!email || !password) {
        logger.info(config.message.user.email_not_exists)
        reject({
          code: 'user.email_not_exists',
          messsage: `${config.message.user.email_not_exists}`
        })
      }

      resolve()
    })
  }

  // 중복 아이디 검사
  const checkUserDup = () => {
    return new Promise((resolve, reject) => {
      User.findOne({email: email}, (err, user) => {
        if (err) {
          reject(err)
        }

        if (!_.isEmpty(user)) {
          reject({
            code: 'user.user_id_already_exists',
            message: config.message.user.user_id_already_exists
          })
        }

        resolve()
      })
    })
  }

  // 사용자 생성
  const createUser = () => {
    return new Promise((resolve, reject) => {
      // 비밀번호 암호화
      const crypted = crypto.createHmac('sha1', config.admin_secret_key)
                      .update(password)
                      .digest('base64')

      let user = {
        email: email,
        password: crypted,
        name: name,
        phone: phone
      }
      User.create(user)

      resolve(user)
    })
  }

  checkParam()
  .then(checkUserDup)
  .then(createUser)
  .then(() => {
    return res.status(200).json({
      message: `${email} 사용자가 등록 되었습니다.`,
      email: email
    })
  })
  .catch((err) => {
    let errCode = err.code || 'common.not_define_error'
    let errMsg = err.message || config.message.common.not_define_error

    logger.error(err)

    return res.status(400).json({
      code: errCode,
      message: errMsg
    })
  })
}

/**
 * login
 * token 발급
 */
exports.login = (req, res) => {
  const {adminId, password} = req.body

  // 파라미터 체크
  const checkParam = () => {
    return new Promise((resolve, reject) => {
      if (!adminId || !password) {
        reject({
          code: 'user.amdin_info_not_exists',
          messsage: config.messsage.user.amdin_info_not_exists
        })
      }

      resolve()
    })
  }

  // id / password 체크
  const checkAdminPassword = () => {
    return new Promise((resolve, reject) => {
      const encrypted = crypto.createHmac('sha1', config.admin_secret_key)
                        .update(password)
                        .digest('base64')

      User.findOne({admin_id: adminId, password: encrypted}, (err, user) => {
        if (err) {
          reject(err)
        }

        if (_.isEmpty(user)) {
          reject({
            code: 'user.login_can_not_pass',
            message: config.message.user.admin_login_can_not_pass
          })
        }

        resolve(user)
      })
    })
  }

  // 토큰 생성
  const generateToken = (user) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          admin_id: user.admin_id,
          name: user.name,
          admin: user.is_admin
        },
        config.admin_token_secret_key,
        {
          expiresIn: config.admin_token_expiresIn,
          issuer: 'barogomove.com',
          subject: 'admin'
        }, (err, token) => {
          if (err) {
            reject(err)
          }

          logger.info(token)

          resolve({
            user: user,
            token: token
          })
        })
    })
  }

  checkParam()
  .then(checkAdminPassword)
  .then(generateToken)
  .then((result) => {
    return res.status(200).json({
      adminId: result.user.admin_id,
      token: result.token
    })
  })
  .catch((err) => {
    let errCode = err.code || 'common.not_define_error'
    let errMsg = err.message || config.message.common.not_define_error

    logger.error(err)

    return res.status(400).json({
      code: errCode,
      message: errMsg
    })
  })
}
