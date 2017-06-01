'use strict'

const express = require('express')
const router = express.Router()
const auth = require('./auth')
const apikey = require('../../../middlewares/auth') // api key 체크
const authTokenAdmin = require('../../../middlewares/auth_token_admin') // 인증 token 체크

router.post('/', apikey, auth.create) // 사용자 등록
router.post('/login', apikey, auth.login) // 사용자 로그인

module.exports = router
