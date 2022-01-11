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
      if (ws.isAlive === false){
        console.log('Forced WS closing.');
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 2000);
  
  wss.on('close', function close(){
    clearInterval(interval);
  });
}

function expressWsLoad(app, server){
  const wsInstance = expressWs(app, server);
  configWssPingIsAlive(wsInstance.getWss());
  console.log('ExpressWs configured');
  return wsInstance;
}

module.exports = expressWsLoad;