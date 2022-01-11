const Plc = require('../models/plc');
const _isEmpty = require('lodash/isEmpty');

async function readMany(filter, projection){
  return await Plc.find(filter, projection);
}

async function readOne(filter, projection){
  if(_isEmpty(filter)) return null;
  return await Plc.findOne(filter, projection);
}

async function existsVersion(versionFilter){
  return await Plc.exists({version: versionFilter});
}

async function updateMany(filter, updatedPlc){
  updatedPlc = {name: updatedPlc.name}; //Can only Update Name
  return await Plc.updateMany(filter, updatedPlc);
}

async function updateOne(filter, updatedPlc){
  updatedPlc = {name: updatedPlc.name}; //Can only Update Name
  return await Plc.updateOne(filter, updatedPlc);
}

async function deleteMany(filter){
  return await Plc.deleteMany(filter);
}

async function deleteOne(filter){
  return await Plc.deleteOne(filter);
}

module.exports = {readMany, readOne, existsVersion, updateMany, updateOne, deleteMany, deleteOne};