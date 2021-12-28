const {env} = require('./utils/env');
const express = require('express');
require('express-async-errors');
const port = env.APP_PORT || 3333;
const load = require('./loaders/load');

async function startServer(){
  try{
    const app = express();
    await load(app);
    app.listen(port);
    console.log(`App listening at http://localhost:${port}`);
  } catch(err){
    console.log('Error while initializing server!');
    console.dir(err);
  }
}

startServer();

