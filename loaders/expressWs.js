const expressWs = require('express-ws');

function heartbeat() {
  this.isAlive = true;
  console.log('Pong received!');
}

function configWssPingIsAlive(wss){
  wss.on('connection', function connection(ws){
    console.log('client connected');
    ws.isAlive = true;
    ws.on('pong', heartbeat);
  });
  
  const interval = setInterval(function ping(){
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 15000);
  
  wss.on('close', function close(){
    clearInterval(interval);
  });
}

function expressWsLoad(app){
  const wsInstance = expressWs(app);
  configWssPingIsAlive(wsInstance.getWss());
  console.log('ExpressWs configured');
  return wsInstance;
}

module.exports = expressWsLoad;