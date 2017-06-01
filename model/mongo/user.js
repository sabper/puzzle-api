'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  name: String, // 사용자 이름
  phone: String, // 사용자 전화번호
  password: String, // 비밀번호
  uid: String, // 사용자 uid from firebase
  email: String, // 사용자 email
  create_dt: {type: Date, default: Date.now}, // 등록일시
  update_dt: {type: Date, default: Date.now}, // 수정일시
  device_token: String // device token
})

User.statics.findOneByphone = function (phone) {
  return this.findOne({
    phone
  }).exec()
}

User.statics.create = function (userArr) {
  const user = new this(userArr)

  return user.save()
}

module.exports = mongoose.model('User', User)
