const wsSrv = require('../../services/ws');

function arduinoPlc(ws, req){
  console.log('WS CONTROLLER REACHED');
  ws.on('open', wsSrv.arduinoOpen);
  ws.on('message', wsSrv.arduinoMessage);
  ws.on('close', wsSrv.arduinoClose);
}

module.exports = {arduinoPlc};