const wsSrv = require('../../services/ws');

function arduinoPlc(ws, req){
  ws.on('open', wsSrv.arduinoOpen);
  ws.on('message', wsSrv.arduinoMessage);
}

module.exports = {arduinoPlc};