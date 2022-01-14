const Plc = require('../models/plc');
const {IOs, types} = require('../utils/env');
const _sortedIndex = require('lodash/sortedIndex');
const createError = require('http-errors');

//Devices PLC (Applies for just ONE PLC at time)==================
async function addOneDevice(filter, io, type, newDev){
  console.log(newDev);
  
  if(!IOs.includes(io)) throw createError(400, 'Invalid IO');
  if(!types.includes(type)) throw createError(400, 'Invalid Type');
  if(typeof newDev != 'object') throw createError(400, 'Device must be an object');

  const path = `${io}.${type}`;

  const plc = await Plc.findOne(filter, `version.${path} devices.${path}`);
  if(!plc) throw createError(404, 'PLC not found');

  const qtPorts = plc.version[path];
  if(!(newDev.port>=0 && newDev.port<qtPorts)) //check valid range newDev.port
    throw createError(400,
      `Invalid device port: expected port number in [0,${qtPorts-1}], but received ${newDev.port}`);

  const plcDevs = plc[path];
  const i = _sortedIndex(plcDevs, newDev, (val)=>val.port);

  if(plcDevs[i].port==newDev.port) //check conflicting newDev.port
    throw createError(409, `Invalid device port: port ${newDev.port} is already in use`);

  plcDevs.splice(i, 0, newDev); //ordered inserting by port
  
  await plc.save();
}

async function deleteDevices(filter, io, type, ports){
  if(!IOs.includes(io)) throw createError(400, 'Invalid IO');
  if(!types.includes(type)) throw createError(400, 'Invalid Type');
  if(typeof ports === 'string') ports = ports.split(' ');
  if(typeof ports !== 'array') throw createError(400, 'Invalid ports definition');
  
  return await Plc.updateMany(filter,{
    $pullAll:{
      [`devices.${io}.${type}.$.port`]: ports
    }
  });
}
//================================================================

module.exports = {addOneDevice, deleteDevices};