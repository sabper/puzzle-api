'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  NODE_ENV: joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .required(),
  MAIL_ID: joi.string()
    .required(),
  MAIL_PASS: joi.string()
    .required()
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  base_domain: '52.192.182.209:3000',
  confirm_uri: '/users/user/verify',
  // firebase
  firebase_key_path: '../firebase/barogorider-firebase-adminsdk-ftzyp-04af09b012.json',
  firebase_push_uri: 'https://fcm.googleapis.com/fcm/send',
  firebase_push_key: 'key=AAAAfVcNE6A:APA91bHXdFXQbQPh5CIR39FwJcLiDE-i-AofSA4qnHGTLIiADQzDe2LfKVD2bF6uv8xutFZY0bhYSWwn21c7bu79vi8_udN53FcdNyvBZIHMum3LOUrK0K3PYI7sks86ev3vchiWLy13vQ2QqzD0Yu76GLdp8MsGwg',
  // mail
  mail_id: envVars.MAIL_ID,
  mail_pass: envVars.MAIL_PASS,
  mail_retry: 3,
  mail_smtp_domain: 'mail.barogo.com',
  mail_smtp_port: 587,
  // admin 암호화 키
  admin_secret_key: envVars.ADMIN_SECRET_KEY,
  admin_token_expiresIn: envVars.ADMIN_TOKEN_EXPIRESIN,
  admin_token_secret_key: envVars.ADMIN_TOKEN_SECRET_KEY
}

module.exports = config
