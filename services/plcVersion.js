const {PlcVersion} = require('../models/plcVersion');
const Plc = require('../models/plc');
const _isEmpty = require('lodash/isEmpty');
const createError = require('http-errors');

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

async function updateDependents(filter, updatedPlcVer){
  
}

async function updateMany(filter, updatedPlcVer){
  delete updatedPlcVer._id; //removing update on _id
  delete updatedPlcVer.createdAt; //removing update on createdAt

  const result = await PlcVersion.updateMany(filter, updatedPlcVer);
  if(result.acknowledged && result.modifiedCount>0)
    await plcSrv.updateVersion(filter, updatedPlcVer);
  return result;
}

async function updateOne(filter, updatedPlcVer){
  delete updatedPlcVer._id; //removing update on _id
  delete updatedPlcVer.createdAt; //removing update on createdAt

  const plcVer = await PlcVersion.findOne(filter, '_id');
  if(!plcVer) return {acknowledged: true, matchedCount:0, modifiedCount: 0};

  const result = await PlcVersion.updateOne(plcVer, updatedPlcVer);
  if(result.acknowledged && result.modifiedCount>0)
    await plcSrv.updateVersion(plcVer, updatedPlcVer);

  return result;
}

//Handles delete PLC version conflict
async function deleteDependentHandler(filter, delDependents){
  let runDel = true;
  if(!delDependents && (runDel = await plcSrv.existsVersion(filter)))
    throw createError(409, 'Dependency error: there is some PLC dependent on the specified version(s).');
  
  if(runDel) await plcSrv.deleteVersion(filter);
}

async function deleteMany(filter, delDependents){
  await deleteDependentHandler(filter, delDependents);
  return await PlcVersion.deleteMany(filter);
}

async function deleteOne(filter, delDependents){
  const plcVer = await PlcVersion.findOne(filter, '_id');
  if(!plcVer) return {deletedCount: 0};

  await deleteDependentHandler(plcVer, delDependents);
  return await PlcVersion.deleteOne(plcVer);
}

module.exports = {readMany, readOne, create, updateMany, updateOne, deleteMany, deleteOne};