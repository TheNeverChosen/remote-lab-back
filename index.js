const {env} = require('./utils/env');
const express = require('express');
require('express-async-errors');
const port = env.APP_PORT || 3333;
const load = require('./loaders/load');

const https = require('https');
const fs = require('fs');

async function startServer(){
  try{
    const app = express();
    await load(app);

    if(env.NODE_ENV=='production'){
      const httpsServer = https.createServer({
        key: fs.readFileSync(`${env.SSL_PATH}/private.key`),
        cert: fs.readFileSync(`${env.SSL_PATH}/certificate.crt`),
        ca: fs.readFileSync(`${env.SSL_PATH}/ca_bundle.crt`)
      }, app);
      httpsServer.listen(port, ()=>{console.log(`HTTPS App listening at port ${port}`);})
    } else{
      app.listen(port, ()=>{console.log(`App listening at http://localhost:${port}`);});
    }
  } catch(err){
    console.log('Error while initializing server!');
    console.dir(err);
  }
}

startServer();

