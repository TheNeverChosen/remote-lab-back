const Plc = require('../models/plc');
const arduinoTranslate = require('./arduinoTranslate');
const wsArduinoSrv = require('./wsArduino');
const createError = require('http-errors');

async function launchToArduino(plcFilter, clientProtocol){
  const plc = plcFilter ? await Plc.findOne(plcFilter) : null;
  if(!plc) throw createError(404, 'PLC not found');

  if(!wsArduinoSrv.isPlcOnline(plc.reference)) throw createError('Error: PLC is offline.');

  const arduinoMsg = arduinoTranslate.clientToArduinoProtocol(plc.toObject(), clientProtocol, wsArduinoSrv.msgCodes.PROTOCOL);
  console.log(arduinoMsg);
  wsArduinoSrv.wsSendMessageToPlc(plc.reference, arduinoMsg);
  return arduinoMsg;
}

module.exports = {launchToArduino};