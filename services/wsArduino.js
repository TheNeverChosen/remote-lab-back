/*
MsgCode (message type) -> 1 Byte

CASE 0 (CLP Register/Identification):
  version(3 bytes) reference(todo o resto)
*/

const { flattenObj } = require('../utils/transform');
const plcSrv = require('./plc');
const arduinoTranslate = require('./arduinoTranslate');
const {env} = require('../utils/env');

const msgCodes=Object.freeze({
  IDENTIFICATION: 0,
  PROTOCOL: 1
});

const onlinePlcs = []; //array of online PLC wsClients

function isPlcOnline(plcRef){
  return onlinePlcs.some(el => el.plcRef==plcRef);
}

function findPlcWsClient(plcRef){
  return onlinePlcs.find(el => el.plcRef==plcRef);
}

async function arduinoLogin(wsClient, plc){
  if(isPlcOnline(plc.reference)) throw new Error('PLC already online');

  const {reference, version} = plc;

  if(!(await plcSrv.exists({reference}))) //is it a new PLC?
    await plcSrv.create(reference, flattenObj(version)); //creating new PLC

  wsClient.plcRef = reference; //PLC reference on wsClient
  onlinePlcs.push(wsClient); //Saving online PLC
}

function wsSendMessageToPlc(plcRef, msg){
  const wsClient = findPlcWsClient(plcRef);
  wsClient.send(msg);
}

async function wsReceiveMessage(data){
  if(!(data instanceof Buffer)) return this.send('ERROR: Non binary received');

  if(data.length<1) return this.send('ERROR: Invalid Message (Empty)');
  const code = data[0];
  
  console.log(data.length);
  console.log(data);

  try{
    switch(code){
      case msgCodes.IDENTIFICATION:
        const plc = arduinoTranslate.arduinoDetails(data, 1);
        console.log(plc);
        await arduinoLogin(this, plc);
        console.log(onlinePlcs);
        this.send('Successful login');
        break;
      default:
        this.send('ERROR: Invalid Message Code');
    }
  } catch(err){
    const errMsg = `${err.message}`;
    if(env.NODE_ENV=='development') console.log(errMsg);
    this.send(errMsg);
  }
}

function wsClose(){
  console.log('Online before: ');
  console.log(onlinePlcs);
  onlinePlcs.splice(onlinePlcs.findIndex(el => el.plcRef==this.plcRef), 1);
  console.log('Online after: ');
  console.log(onlinePlcs);

  console.log('Arduino graceful disconnect');
}

module.exports = {msgCodes, isPlcOnline, wsSendMessageToPlc, wsReceiveMessage, wsClose};