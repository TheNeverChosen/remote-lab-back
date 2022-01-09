// const clpVerSrv = require('./clpVersion');
const Clp = require('../models/clp');
const $ = require('mongo-dot-notation');
const _isEmpty = require('lodash/isEmpty');

async function readMany(filter, projection){
  return await Clp.find(filter, projection);
}

async function readOne(filter, projection){
  if(_isEmpty(filter)) return null;
  return await Clp.findOne(filter, projection);
}

async function updateMany(filter, updatedClp){
  updatedClp = {name: updatedClp.name}; //Can only Update Name
  return await Clp.updateMany(filter, $.flatten(updatedClp));
}

async function updateOne(filter, updatedClp){ 
  updatedClp = {name: updatedClp.name}; //Can only Update Name
  return await Clp.updateOne(filter, updatedClp);
}

async function deleteMany(filter){
  return await Clp.deleteMany(filter);
}

async function deleteOne(filter){
  return await Clp.deleteOne(filter);
}

module.exports = {readMany, readOne, updateMany, updateOne, deleteMany, deleteOne};