const _sortedIndexBy = require('lodash/sortedIndexBy');
const _has = require ('lodash/has');
const {env, deviceModels, IOs, types, IOTypeModels} = require('../utils/env');
const createError = require('http-errors');
const {endianesses, uintToArrayBytes, binaryStrToBytes} = require('../utils/transform');

function arduinoDetails(data, iStart){
  if(typeof iStart!='number') iStart=0;
  if(!(iStart+2<data.length)) throw createError(404, 'ERROR: Invalid version (Insufficient Bytes)');
  else if(!(iStart+3<data.length)) throw createError(404, 'ERROR: Invalid reference (Empty)');

  const release = `${data[iStart]}.${data[iStart+1]}.${data[iStart+2]}`;
  const version = {release};

  let reference = "";
  for(let i=iStart+3;i<data.length;i++)
    reference += data[i].toString(16).padStart(2, '0');

  return {reference, version};
}

function getIOTypeModel(io, type, model){
  try{
    const ioType = deviceModels[io][type];
    const i = ioType.models.indexOf(model);
    if(!(i>=0 && i<ioType.models.length))
      throw createError(404, `ERROR: \"${model}]\" is not a valid ${type} ${io} model`); 
    return ioType.IOTypeModels[i];
  } catch(err){
    if(env.NODE_ENV=='development') console.log(err);
    return null;
  }
}

function genDevWithVars(devices, devVars, qtVars){
  let totalDevices=0, totalDevVars=0;
  const checkVars={};

  for(const io of IOs){
    for(const type of types){
      if(!_has(devVars, [io,type])){
        delete devices[io][type]; continue;
      }
      
      //based on current io-type:
      const deviceArr = devices[io][type]; //devices array
      const varArr = devVars[io][type];    //variables array
      
      for(const v of varArr){ //iterating over variables array
        if(!(v.id>=0 && v.id<qtVars)) throw createError(404, `Invalid variable id: expected variable id in [0,${qtVars}], but received ${v.id}, inside of ${type} ${io}.`);
        if(checkVars[v.id]) throw createError(404, `ERROR: duplicated id (${v.id}).`);
        else checkVars[v.id]=true;

        const iDev = _sortedIndexBy(deviceArr, v, (val)=>val.port); //searching for device on port
        if(!(iDev<deviceArr.length && deviceArr[iDev].port==v.port))
          throw createError(404, `ERROR: invalid ${type} ${io} port (${v.port}) in variable with id ${v.id}`);

        const dev = deviceArr[iDev]; //getting device on target port
        if(!Array.isArray(dev.varArr)){ //first variable added
          dev.IOTypeModel = getIOTypeModel(io, type, dev.model); //setting IOTypeModel
          dev.varArr = []; //creating variables array
          totalDevices++; //incrementing total os used devices
        }
        dev.varArr.push(v); totalDevVars++;
      }

      devices[io][type] = deviceArr.filter(dev=>Array.isArray(dev.varArr));
    }
  }

  return {totalDevices, totalDevVars, devWithVars: devices};
}

function parseVarIO_IN_AL_GEN(v){
  const res=[];
  const {id, extras} = v;
  const checkDiv={};
  
  res.push(id);

  const qtDivs = extras.divs.length;
  res.push(...uintToArrayBytes(qtDivs, endianesses.LITTLE, 2));
  
  for(const div of extras.divs){
    if(checkDiv[div])
      throw createError(404, `ERROR: duplicate analog divisor (${div}) in variable ${id}`)
    else checkDiv[div]=true;
    res.push(...uintToArrayBytes(div, endianesses.LITTLE, 2));
  }

  res.push(...binaryStrToBytes(extras.zones));
  res.push(...binaryStrToBytes(extras.dominances));

  return res;
}

function parseVar(IOTpMdCode, v){
  switch(IOTpMdCode){
    case IOTypeModels.IO_IN_AL_GEN:
      return parseVarIO_IN_AL_GEN(v);
    default:
      return [v.id];
  }
}

function parseDevWithVars(devWithVars){
  const devVarArr=[];

  for(const io of IOs){
    for(const type of types){
      if(!_has(devWithVars, [io,type])) continue;
      for(const dev of devWithVars[io][type]){
        const IOTpMdCode = dev.IOTypeModel.code;
        
        devVarArr.push(IOTpMdCode, dev.port, dev.varArr.length);
        for(const v of dev.varArr)
          devVarArr.push(...parseVar(IOTpMdCode, v));
      }
    }
  }
  
  return devVarArr;
}

function parseDiagram(diagram){
  return [];
}

function clientToArduinoProtocol(plc, clientProtocol, atStart){
  if(Array.isArray(atStart))
    atStart = atStart.filter(val=>(typeof val == 'number'));
  else
    atStart = (typeof atStart=='number') ? [atStart] : [];

  const {qtVars, devVars} = clientProtocol;

  if(!(typeof qtVars=='number' && qtVars>=0 && qtVars<=env.PLC_MAX_VARS))
    throw createError(404, `Invalid qtVars: expected qtVars as a number in [0,${env.PLC_MAX_VARS}], but received (${qtVars}).`);

  const {totalDevices, totalDevVars, devWithVars} = genDevWithVars(plc.devices, devVars, qtVars);
  const devVarArr = parseDevWithVars(devWithVars);
  const diagram = parseDiagram(clientProtocol.diagram);

  return {qtVars: clientProtocol.qtVars, totalDevVars, totalDevices, devWithVars, devVarArr, diagram: clientProtocol.diagram, parsedDiagram: diagram, result:new Uint8Array([...atStart, totalDevices, qtVars, ...devVarArr, ...diagram])};
}

module.exports = {arduinoDetails, clientToArduinoProtocol};