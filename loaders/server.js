const {env} = require('../utils/env');
const express = require('express');
require('express-async-errors');
const load = require('./load');
const http = require('http');
const https = require('https');
const fs = require('fs');

function redirectHttps(req, res, next){
  req.secure ? next() : res.redirect('https://' + req.headers.host + req.url);
}

async function createApp(){
  const app = express();
  if(env.NODE_ENV=='production') app.use(redirectHttps);
  await load(app);
  return app;
}

function startServer(app){
  if(env.NODE_ENV=='production'){
    const httpsCreds = {
      key: fs.readFileSync(`${env.SSL_PATH}/private.key`),
      cert: fs.readFileSync(`${env.SSL_PATH}/certificate.crt`),
      ca: fs.readFileSync(`${env.SSL_PATH}/ca_bundle.crt`)
    };
    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(httpsCreds, app);

    httpServer.listen(80, ()=>{console.log(`HTTP Redirector listening at port 80`);});
    httpsServer.listen(443, ()=>{console.log(`HTTPS App listening at port 443`);});
  } else{
    const port = env.APP_PORT || 3333;
    app.listen(port, ()=>{console.log(`App listening at http://localhost:${port}`);});
  }
}

module.exports = {createApp, startServer};
