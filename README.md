# puzzle-api

* Puzzle api server

* node.js v6.9.4 -> nvm

* mongodb 3.4.2

* redis 3.2.7

* es6

  > http://es6-features.org/#ValueExportImport

* mongoose : http://mongoosejs.com/docs/

  > http://mongoosejs.com/docs/

<br/>

## 환경 변수 설정

* 환경 변수 barogo_api.env (프로젝트 root 위치) 파일 생성

```
NODE_ENV=production
PROCESS_TYPE=api
LOGGER_LEVER=debug
MONGO_URI=mongodb://${id}:${pass}@${domain}:${port}/barogo
REDIS_URI=redis://127.0.0.1:6379
PORT=3000
LANG_TYPE=ko
MAIL_ID=${id}
MAIL_PASS=${pass}
```

<br/>

## 시작 / 종료 / 재시작

### web

pm2 를 사용 하여 node process 관리

```
cd ${home}/puzzle-api
pm2 start ./pApi_pm2_config.json
pm2 stop pApi
pm2 restart pApi
pm2 logs pApi
pm2 logs pApi --lines 1000
```

<br/>

## logging

#### log rotate

  > https://github.com/pm2-hive/pm2-logrotate

* 기본 설정으로 rotate

* 10M 넘어가면 rotate

* 매일 자정 rotate

* rotate 체킹 주기 30초

* 모든 로그를 적재한다. (retain option 으로 개수 조정 가능)

#### error log slack noti

  > https://github.com/mattpker/pm2-slack

  ```
  pm2 install pm2-slack
  pm2 set pm2-slack:slack_url ${https://slack_url}
  ```
