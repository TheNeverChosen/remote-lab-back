require('dotenv').config({path: 'config/.env'});

const penv = process.env;

module.exports = {
  env: {
    NODE_ENV: penv.NODE_ENV || 'development',
    MONGO_USER: penv.MONGO_USER,
    MONGO_PASS: penv.MONGO_PASS,
    MONGO_NAME: penv.NODE_ENV=='production' ? penv.MONGO_NAME : 'development',
    REDIS_PASS: penv.REDIS_PASS,
    SESSION_NAME: penv.SESSION_NAME,
    SESSION_SECRET: penv.SESSION_SECRET,
    SESSION_MAX_AGE: parseInt(penv.SESSION_MAX_AGE),
    APP_PORT: penv.APP_PORT,
    SSL_PATH: penv.SSL_PATH
  },
  roles: ['MASTER', 'ADMIN', 'DEFAULT'],
  IOs: ['input', 'output'],
  types: ['digital', 'analog'],
  deviceModels: {
    input:{
      digital:{
        models: ['GENERIC'],
        typeModels: [{name: 'IO_IN_DG_GEN', code:1}]
      },
      analog:{
        models: ['GENERIC'],
        typeModels: [{name: 'IO_IN_AL_GEN', code: 101}]
      }
    },
    output:{
      digital:{
        models: ['GENERIC'],
        typeModels: [{name: 'IO_OUT_DG_GEN', code: 201}]
      },
      analog:{
        models: [],
        typeModels: []
      }
    }
  }
};