const wsArduinoSrv = require('../../services/wsArduino');

function arduinoPlc(ws, req){
  console.log('WS CONTROLLER REACHED');
  ws.on('open', wsArduinoSrv.arduinoOpen);
  ws.on('message', wsArduinoSrv.arduinoMessage);
  ws.on('close', wsArduinoSrv.arduinoClose);
  ws.on('error', (err)=>{console.log(err)});
}

module.exports = {arduinoPlc};