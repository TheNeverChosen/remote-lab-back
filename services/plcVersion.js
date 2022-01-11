const {PlcVersion} = require('../models/plcVersion');
const plcSrv = require('./plc');
const _isEmpty = require('lodash/isEmpty');
const createError = require('http-errors');
const {flattenObj} = require('../utils/transform');

async function readMany(filter, projection){
  return await PlcVersion.find(filter, projection);
}

async function readOne(filter, projection){
  if(_isEmpty(filter)) return null;
  return await PlcVersion.findOne(filter, projection);
}

async function create(plcVersion){
  plcVersion.createdAt = new Date();
  await PlcVersion.create(plcVersion);
}

//Handles update PLC version conflict and cleans updatedPlcVer
async function updateDependentHandler(filter, updatedPlcVer){
  delete updatedPlcVer._id; //removing update on _id
  delete updatedPlcVer.createdAt; //removing update on createdAt
  const updatedPlc = flattenObj({version:updatedPlcVer});
  await plcSrv.updateMany({version: filter}, updatedPlc);
}

async function updateMany(filter, updatedPlcVer){
  await updateDependentHandler(filter, updatedPlcVer);
  return await PlcVersion.updateMany(filter, updatedPlcVer);
}

async function updateOne(filter, updatedPlcVer){
  const plcVer = await PlcVersion.findOne(filter, '_id');
  if(!plcVer) return {acknowledged: true, matchedCount:0, modifiedCount: 0};

  await updateDependentHandler(plcVer, updatedPlcVer);
  return await PlcVersion.updateOne(plcVer, updatedPlcVer);
}

//Handles delete PLC version conflict
async function deleteDependentHandler(filter, delPlc){
  let runDel = true;
  if(!delPlc && (runDel = await plcSrv.existsVersion(filter)))
    throw createError(409, 'Dependency error: there is any PLC dependent on this version.');
  
  if(runDel) await plcSrv.deleteMany({version: filter});
}

async function deleteMany(filter, delPlc){
  await deleteDependentHandler(filter, delPlc);
  return await PlcVersion.deleteMany(filter);
}

async function deleteOne(filter, delPlc){
  const plcVer = await PlcVersion.findOne(filter, '_id');
  if(!plcVer) return {deletedCount: 0};

  await deleteDependentHandler(plcVer, delPlc);
  return await PlcVersion.deleteOne(plcVer);
}

module.exports = {readMany, readOne, create, updateMany, updateOne, deleteMany, deleteOne};