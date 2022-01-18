const Plc = require('../models/plc'); 
const plcVerSrv = require('./plcVersion');
const _isEmpty = require('lodash/isEmpty');
const {mongoose} = require('../loaders/mongo');
const createError = require('http-errors');
const {flattenObj} = require('../utils/transform');

async function readMany(filter, projection){
  return await Plc.find(filter, projection);
}

async function readOne(filter, projection){
  if(_isEmpty(filter)) return null;
  return await Plc.findOne(filter, projection);
}

async function existsVersion(verFilter){
  if(_isEmpty(verFilter) && await Plc.exists({})) return true;
  const plcFilter = flattenObj({version: verFilter});
  return await Plc.exists(plcFilter);
}

async function create(reference, plcVerFilter){

  // if(!reference) throw createError(404, "plc validation failed: reference: PLC name is required")

  console.log(plcVerFilter);
  let plcVer = await plcVerSrv.readOne(plcVerFilter);

  console.log(plcVer);
  if(!plcVer) throw createError(404, 'PLC version not found');
  else if(!(plcVer instanceof mongoose.Document)) throw (500, 'Unexpected error while searching PLC version');
  else plcVer = plcVer.toObject();

  const plc = {
    reference: reference,
    name: reference,
    version: plcVer,
    createdAt: new Date()
  };

  console.log(plc);

  await Plc.create(plc);
}

async function updateMany(filter, updatedPlc){
  updatedPlc = {name: updatedPlc.name}; //Can only Update Name
  return await Plc.updateMany(filter, updatedPlc);
}

async function updateOne(filter, updatedPlc){
  updatedPlc = {name: updatedPlc.name}; //Can only Update Name
  return await Plc.updateOne(filter, updatedPlc);
}

async function updateVersion(verFilter, updatedPlcVer){
  const plcFilter = flattenObj({version: verFilter});
  const updatedPlc = flattenObj({version: updatedPlcVer});
  return await Plc.updateMany(plcFilter, updatedPlc);
}

async function deleteMany(filter){
  return await Plc.deleteMany(filter);
}

async function deleteOne(filter){
  return await Plc.deleteOne(filter);
}

async function deleteVersion(verFilter){
  if(_isEmpty(verFilter) && await Plc.exists({})) return Plc.deleteMany({});
  const plcFilter = flattenObj({version: verFilter});
  console.log(plcFilter);
  return await Plc.deleteMany(plcFilter);
}

module.exports = {readMany, readOne, existsVersion, create, updateMany, updateOne, updateVersion, deleteMany, deleteOne, deleteVersion};