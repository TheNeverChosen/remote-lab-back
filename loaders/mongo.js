const {env} = require('../utils/env');
const mongoose = require('mongoose');
const url = `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PASS}@cluster0.fqmgp.mongodb.net/${env.MONGO_NAME}`;
const sanitize = require('mongo-sanitize');

async function mongoCon(){
  console.log("Connecting to MongoDB...");
  await mongoose.connect(url);
  if(mongoose.connection.readyState==1) console.log("Connected to MongoDB.");
  else console.log("Couldn't connect to MongoDB");
}

function sanitizeReq(req, res, next){
  req.params = sanitize(req.params);
  req.query = sanitize(req.query);
  req.body = sanitize(req.body);
  return next();
}

mongoose.set('runValidators', true);

module.exports = {mongoCon, mongoose, mongoSanitize: ()=>sanitizeReq};