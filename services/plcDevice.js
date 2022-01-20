const Plc = require('../models/plc');
const {IOs, types} = require('../utils/env');
const _sortedIndexBy = require('lodash/sortedIndexBy');
const createError = require('http-errors');

//Devices PLC (Applies for just ONE PLC at time)==================
async function addOneDevice(filter, io, type, newDev){
  if(!IOs.includes(io)) throw createError(400, 'Invalid IO');
  if(!types.includes(type)) throw createError(400, 'Invalid Type');
  if(typeof newDev != 'object') throw createError(400, 'Device must be an object');

  const path = `${io}.${type}`;

  const plc = await Plc.findOne(filter, `version.${path} devices.${path}`);
  if(!plc) throw createError(404, 'PLC not found');

  const qtPorts = plc.version[io][type];
  if(qtPorts<=0) //Can't receive any device
    throw createError(400,
      `Invalid device port: PLC doesn't have any ${type} ${io} port.`);
  if(!(newDev.port>=0 && newDev.port<qtPorts)) //check valid range newDev.port
    throw createError(400,
      `Invalid device port: expected ${type} ${io} port number in [0,${qtPorts-1}], but received ${newDev.port}`);

  const targetDevs = plc.devices[io][type]; console.log(targetDevs);
  const i = _sortedIndexBy(targetDevs, newDev, (val)=>val.port); console.log(i);
      
  if(newDev.port<targetDevs.length && targetDevs[i].port==newDev.port) //check conflicting newDev.port
    throw createError(409, `Invalid device port: port ${newDev.port} is already in use`);

  targetDevs.splice(i, 0, newDev); //ordered inserting by port
  
  await plc.save();
}

async function deleteDevices(filter, io, type, ports){
  if(!IOs.includes(io)) throw createError(400, 'Invalid IO');
  if(!types.includes(type)) throw createError(400, 'Invalid Type');
  if(typeof ports === 'string') ports = ports.split(' ');
  if(!Array.isArray(ports)) throw createError(400, 'Invalid ports definition');
  
  return await Plc.updateMany(filter,{
    $pull:{
      [`devices.${io}.${type}`]:{
        port:{
          $in: ports
        }
      }
    }
  }, {runValidators:false});
}
//================================================================

module.exports = {addOneDevice, deleteDevices};