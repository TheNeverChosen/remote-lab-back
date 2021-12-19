const env = require('../utils/env');
const mongoose = require('mongoose');
const url = `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PASS}@cluster0.fqmgp.mongodb.net/${env.MONGO_NAME}`;

async function connect(){
  console.log("Connecting to MongoDB...");
  await mongoose.connect(url);
  if(mongoose.connection.readyState==1) console.log("Connected to MongoDB.");
  else console.log("Couldn't connect to MongoDB");
}

module.exports = {connect, mongoose};