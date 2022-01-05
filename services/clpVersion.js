const {ClpVersion} = require('../models/clpVersion');
const $ = require('mongo-dot-notation');

async function readAll(filter){
  const clpVerArr = await ClpVersion.find(filter);
  return clpVerArr;
}

async function readOne(filter){
  const clpVer = await ClpVersion.findOne(filter);
  return clpVer;
}

async function create(clpVersion){
  clpVersion.createdAt = new Date();
  await ClpVersion.create(clpVersion);
}

async function updateAll(filter, updatedClpVer){
  delete updatedClpVer._id; //removing update on _id
  delete updatedClpVer.createdAt; //removing update on createdAt
  return await ClpVersion.updateMany(filter, $.flatten(updatedClpVer));
}

async function updateOne(filter, updatedClpVer){
  delete updatedClpVer._id; //removing update on _id
  delete updatedClpVer.createdAt; //removing update on createdAt
  return await ClpVersion.updateOne(filter, $.flatten(updatedClpVer));
}

async function deleteOne(filter){
  return await ClpVersion.deleteOne(filter);
}

module.exports = {readAll, readOne, create, updateAll, updateOne, deleteOne};