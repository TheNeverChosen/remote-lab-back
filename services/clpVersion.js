const {ClpVersion} = require('../models/clpVersion');
const $ = require('mongo-dot-notation');

async function readMany(filter, projection){
  const clpVerArr = await ClpVersion.find(filter, projection);
  return clpVerArr;
}

async function readOne(filter, projection){
  const clpVer = await ClpVersion.findOne(filter, projection);
  return clpVer;
}

async function create(clpVersion){
  clpVersion.createdAt = new Date();
  await ClpVersion.create(clpVersion);
}

async function updateMany(filter, updatedClpVer){
  delete updatedClpVer._id; //removing update on _id
  delete updatedClpVer.createdAt; //removing update on createdAt
  return await ClpVersion.updateMany(filter, $.flatten(updatedClpVer));
}

async function updateOne(filter, updatedClpVer){
  delete updatedClpVer._id; //removing update on _id
  delete updatedClpVer.createdAt; //removing update on createdAt
  return await ClpVersion.updateOne(filter, updatedClpVer);
}

async function deleteOne(filter){
  return await ClpVersion.deleteOne(filter);
}

module.exports = {readMany, readOne, create, updateMany, updateOne, deleteOne};