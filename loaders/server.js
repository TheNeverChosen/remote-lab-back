const {env} = require('../utils/env');
const express = require('express');
require('express-async-errors');
const load = require('./load');
const http = require('http');
const https = require('https');
const fs = require('fs');

async function createApp(){
  const app = express();
  await load(app);
  return app;
}

function redirectHttps(req, res){
  res.redirect('https://' + req.headers.host + req.url);
}

function startServer(app){
  if(env.NODE_ENV=='production'){
    const httpsCreds = {
      key: fs.readFileSync(`${env.SSL_PATH}/private.key`),
      cert: fs.readFileSync(`${env.SSL_PATH}/certificate.crt`),
      ca: fs.readFileSync(`${env.SSL_PATH}/ca_bundle.crt`)
    };
    const httpsServer = https.createServer(httpsCreds, app);
    const httpServer = http.createServer(redirectHttps);

    httpsServer.listen(443, ()=>{console.log(`HTTPS App listening at port 443`);});
    httpServer.listen(80, ()=>{console.log(`HTTP Redirector listening at port 80`);});
  } else{
    const port = env.APP_PORT || 3333;
    app.listen(port, ()=>{console.log(`App listening at http://localhost:${port}`);});
  }
}

module.exports = {createApp, startServer};
