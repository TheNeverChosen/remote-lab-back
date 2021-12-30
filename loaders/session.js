const {env} = require('../utils/env');
const session = require('express-session');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);

const sessionConfig = {
  name: env.SESSION_NAME,
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie 
    sameSite: 'none',
    maxAge: env.SESSION_MAX_AGE // session max age in miliseconds
  }
};

function createSession(client){
  sessionConfig.store = new RedisStore({client});
  return session(sessionConfig);
}

module.exports = createSession;