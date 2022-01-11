const {env} = require('../utils/env');
const express = require('express');
require('express-async-errors');
const load = require('./load');
const http = require('http');
const https = require('https');
const fs = require('fs');
const expressWs = require('./expressWs');

function redirectHttps(req, res, next){
  console.log('\n\n==========>>> Protocol: ' + req.protocol);

  if(req.secure){
    console.log('==========Conexao segura iniciada!==========');
    console.log('Prosseguindo...');
    next();
  }
  else{
    console.log('==========Conexao sem segurança iniciada==========');
    console.log('redirecionando para https...');
    res.redirect('https://' + req.headers.host + req.url);
  }

  //req.secure ? next() : res.redirect('https://' + req.headers.host + req.url);
}

async function loadApp(app, server){
  expressWs(app, server);  //setting WebSocket server, and app.ws method
  
  if(env.NODE_ENV=='production') app.use(redirectHttps);
  await load(app); //load App (DB, routes, auth, etc...)
}

async function startServer(){
  const app = express();
  if(env.NODE_ENV=='production'){
    const httpsCreds = {
      key: fs.readFileSync(`${env.SSL_PATH}/private.key`),
      cert: fs.readFileSync(`${env.SSL_PATH}/certificate.crt`),
      ca: fs.readFileSync(`${env.SSL_PATH}/ca_bundle.crt`)
    };
    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(httpsCreds, app);

    await loadApp(app, httpsServer);

    httpServer.listen(80, ()=>{console.log(`HTTP Redirector listening at port 80`);});
    httpsServer.listen(443, ()=>{console.log(`HTTPS App listening at port 443`);});
  } else{
    const port = env.APP_PORT || 3333;
    const httpServer = http.createServer(app);
    await loadApp(app, httpServer);
    httpServer.listen(port, ()=>{console.log(`App listening at http://localhost:${port}`);});
    //app.listen(port, ()=>{console.log(`App listening at http://localhost:${port}`);});
  }
}

module.exports = {startServer};
