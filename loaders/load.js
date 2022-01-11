const {mongoCon, mongoSanitize} = require('./mongo'); //initializing mongo connection with mongoose
const {redisCon, redisClient} = require('./redis');
const cors = require('./cors');
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const session = require('./session'); //Session middleware configuration
const router = require('../routes/router');
const error = require('./error');

async function load(app){
  await mongoCon(); //connecting to MongoDB
  await redisCon(); //connecting to Redis

  app.use(cors());
  app.use(compression()); //compression middleware
  app.use(helmet()); //setting helmet
  app.use(express.json()); //parse application/json body
  app.use(session(redisClient)); //setting session middleware with redisClient for storage
  app.use(mongoSanitize()); //sanitizing req params/query/body from xss on MongoDB actions
  app.use(router()); //setting all routes
  app.use(error()); //errors handler
}

module.exports = load;