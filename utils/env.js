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
    SSL_PATH: penv.SSL_PATH,
    WS_PING_TIME: penv.WS_PING_TIME,
    HTTP_PORT: penv.HTTP_PORT,
    HTTPS_PORT: penv.HTTPS_PORT,
    PLC_MAX_PORTS: 256,
    PLC_MAX_VARS: 256,
    PLC_MAX_AL_DIV_VAL: 500
  },
  roles: ['MASTER', 'ADMIN', 'DEFAULT'],
  IOs: ['input', 'output'],
  types: ['digital', 'analog'],
  IOTypeModels: Object.freeze({
    IO_IN_DG_GEN: 1,
    IO_IN_AL_GEN: 101, 
    IO_OUT_DG_GEN: 201
  }),
  deviceModels: {
    input:{
      digital:{
        models: ['GENERIC'],
        IOTypeModels: [{name: 'IO_IN_DG_GEN', code:1}]
      },
      analog:{
        models: ['GENERIC'],
        IOTypeModels: [{name: 'IO_IN_AL_GEN', code: 101}]
      }
    },
    output:{
      digital:{
        models: ['GENERIC'],
        IOTypeModels: [{name: 'IO_OUT_DG_GEN', code: 201}]
      },
      analog:{
        models: [],
        IOTypeModels: []
      }
    }
  }
};