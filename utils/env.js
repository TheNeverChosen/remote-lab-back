require('dotenv').config({path: 'config/.env'});

const penv = process.env;

module.exports = {
  MONGO_USER: penv.MONGO_USER,
  MONGO_PASS: penv.MONGO_PASS,
  MONGO_NAME: penv.MONGO_NAME,
  REDIS_PASS: penv.REDIS_PASS,
  APP_PORT: penv.APP_PORT
};