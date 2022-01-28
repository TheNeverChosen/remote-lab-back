const _set = require('lodash/set');
const _isEmpty = require('lodash/isEmpty');
const {mongoose} = require('../loaders/mongo');
const { isInteger } = require('lodash');
const validator = require('validator');

function flattenObj(ob) {
  if(ob instanceof mongoose.Document)
    return flattenObj(ob.toObject());

  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    
    if(!(ob[i] instanceof mongoose.Types.ObjectId) &&
      !(ob[i] instanceof Date) &&
      (typeof ob[i]) == 'object' && ob[i] !== null) {
      var flatObject = flattenObj(ob[i]);
      if(_isEmpty(flatObject)){
        toReturn[i] = flatObject;
        continue;
      }
      for (var x in flatObject) {
        if(!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    }
    else toReturn[i] = ob[i];
  }
  return toReturn;
}

function expandObj(obj){
  const  newObj = {};
  for(const key in obj)
    _set(newObj, key, obj[key]);
  return newObj;
}

const endianesses=Object.freeze({
  BIG:0,
  LITTLE:1
});

function uintToArrayBytes(x, endianess, fixedBytes){
  if(typeof x!='number' || x<0 || !isInteger(x))
    return null;

  x = Math.abs(parseInt(x));
  
  let qtBytes;
  if(fixedBytes) qtBytes = fixedBytes;
  else{
    const qtBits = x>0 ? Math.floor(Math.log2(x)+1) : 1; 
    qtBytes = Math.ceil(qtBits/8);
  }

  const arr = new Uint8Array(qtBytes);

  switch(endianess){
    case endianesses.BIG:
      for(let i=qtBytes-1;i>=0;i--, x>>=8)
        arr[i]= (x & 0xff);
      break;
    case endianesses.LITTLE:
      for(let i=0;i<qtBytes;i++, x>>=8)
        arr[i]= (x & 0xff);
      break;
    default: return null;
  }
  return arr;
}

function binaryStrToBytes(str){
  if(typeof str!='string') return null; //not string
  str = str.replace(' ', '');
  
  for(let c of str)
    if(!(c=='0' || c=='1')) return null; //not binary string

  const l = str.length;
  const mod = l%8;
  if(mod!=0) str+='0'.repeat(8-mod);

  return uintToArrayBytes(parseInt(str, 2), endianesses.BIG);
}

module.exports={flattenObj, expandObj, endianesses, uintToArrayBytes, binaryStrToBytes};