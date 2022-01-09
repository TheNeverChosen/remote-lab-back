const {ClpVersion} = require('../models/clpVersion');
const _isEmpty = require('lodash/isEmpty');

async function readMany(filter, projection){
  const clpVerArr = await ClpVersion.find(filter, projection);
  return clpVerArr;
}

async function readOne(filter, projection){
  if(_isEmpty(filter)) return null;
  const clpVer = await ClpVersion.findOne(filter, projection);
  return clpVer;
}

async function create(clpVersion){
  clpVersion.createdAt = new Date();
  await ClpVersion.create(clpVersion);
}

async function updateMany(filter, updatedClpVer){
  //check delete CLP conflict????????
  delete updatedClpVer._id; //removing update on _id
  delete updatedClpVer.createdAt; //removing update on createdAt
  return await ClpVersion.updateMany(filter, updatedClpVer);
}

async function updateOne(filter, updatedClpVer){
  //check delete CLP conflict
  delete updatedClpVer._id; //removing update on _id
  delete updatedClpVer.createdAt; //removing update on createdAt
  return await ClpVersion.updateOne(filter, updatedClpVer);
}

async function deleteOne(filter){
  //check delete CLP conflict
  return await ClpVersion.deleteOne(filter);
}

module.exports = {readMany, readOne, create, updateMany, updateOne, deleteOne};