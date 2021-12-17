const env = require('../utils/env');
const mongoose = require('mongoose');

const url = `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PASS}@cluster0.fqmgp.mongodb.net/${env.MONGO_NAME}`;

async function connect(){
  await mongoose.connect(url);
  if(mongoose.connection.readyState==1) console.log("Connected to MongoDB.");
  else console.log("Couldn't connect to MongoDB");
}

connect().catch(console.dir);

module.exports = mongoose;