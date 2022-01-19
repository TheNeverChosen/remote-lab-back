const wsArduinoSrv = require('../../services/wsArduino');

function arduinoPlc(ws, req){
  ws.on('message', wsArduinoSrv.arduinoMessage);
  ws.on('close', wsArduinoSrv.arduinoClose);
  ws.on('error', (err)=>{console.log(err)});
  console.log('Arduino connected!');
}

module.exports = {arduinoPlc};