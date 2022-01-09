const Clp = require('../models/clp');
const {IOs, types} = require('../utils/env');
const _sortedIndex = require('lodash/sortedIndex');

//Devices CLP (Applies for just ONE CLP at time)==================
async function addOneDevice(filter, io, type, newDev){
  if(!IOs.includes(io)) throw createError(400, 'Invalid IO');
  if(!types.includes(type)) throw createError(400, 'Invalid Type');
  if(typeof newDev != 'object') throw createError(400, 'Device must be an object');

  const path = `${io}.${type}`;

  const clp = await Clp.findOne(filter, `version.${path} devices.${path}`);
  if(!clp) throw createError(404, 'CLP not found');

  const qtPorts = clp.version[path];
  if(!(newDev.port>=0 && newDev.port<qtPorts)) //check valid range newDev.port
    throw createError(400,
      `Invalid device port: expected port number in [0,${qtPorts-1}], but received ${newDev.port}`);

  const clpDevs = clp[path];
  const i = _sortedIndex(clpDevs, newDev, (val)=>val.port);

  if(clpDevs[i].port==newDev.port) //check conflicting newDev.port
    throw createError(409, `Invalid device port: port ${newDev.port} is already in use`);

  clpDevs.splice(i, 0, newDev); //ordered inserting by port
  
  await clp.save();
}

async function deleteDevices(filter, io, type, ports){
  if(!IOs.includes(io)) throw createError(400, 'Invalid IO');
  if(!types.includes(type)) throw createError(400, 'Invalid Type');
  if(typeof ports == 'string') ports = ports.split(' ');
  if(typeof ports != 'array') throw createError(400, 'Invalid ports definition');
  
  return await this.updateMany(filter,{
    $pullAll:{
      [`devices.${io}.${type}.$.port`]: ports
    }
  });
}
//================================================================

module.exports = {addOneDevice, deleteDevices};