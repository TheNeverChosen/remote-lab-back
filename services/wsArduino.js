/*
MsgCode (message type) -> 1 Byte

CASE 0 (CLP Register/Identification):
  version(3 bytes) reference(todo o resto)
*/

const { flattenObj } = require('../utils/transform');
const plcSrv = require('./plc');

const msgCode=Object.freeze({
  IDENTIFICATION: 0
});

async function arduinoIdentification(data){
  if(data.length<4) throw new Error('ERROR: Invalid version (Insufficient Bytes)');
  else if(data.lenght<5) return new Error('ERROR: Invalid reference (Empty)');

  const release = `${data[1]}.${data[2]}.${data[3]}`;
  const version = {release};

  let reference = "";
  for(let i=4;i<data.length;i++)
    reference += data[i].toString(16).padStart(2, '0');

  console.log('VERSION:');
  console.log(version);
  console.log(flattenObj(version));
  console.log(`REFERENCE: ${reference}`);

  if(await plcSrv.exists({reference})){
    console.log('CLP JA CADASTRADO NO SISTEMA!');
    return;
  }

  await plcSrv.create(reference, flattenObj(version));
  console.log('NOVO CLP CADASTRADO NO SISTEMA');
}

async function arduinoMessage(data){
  console.log('received: ');
  console.log(data);

  if(data instanceof Buffer){
    console.log('IS BUFFER');

    if(data.length<1) return this.send('ERROR: Invalid Message (Empty)');
    
    const code = data[0];
    try{
      switch(code){
        case msgCode.IDENTIFICATION:
          await arduinoIdentification(data);
          this.send('Successful Connected'); break;
        default:
          this.send('ERROR: Invalid Message Code');
      }
    } catch(err){
      this.send(err.message);
    }
  }
  else this.send('ERROR: Non binary received');
}

function arduinoClose(){
  console.log('Arduino graceful disconnect');
}

module.exports = {arduinoMessage, arduinoClose};