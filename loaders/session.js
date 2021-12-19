const env = require('../utils/env');
const session = require('express-session');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);

const sessionConfig = {
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie 
    maxAge: 1000 * 10 // session max age in miliseconds
  }
};

function createSession(client){
  sessionConfig.store = new RedisStore({client});
  return session(sessionConfig);
}

module.exports = createSession;