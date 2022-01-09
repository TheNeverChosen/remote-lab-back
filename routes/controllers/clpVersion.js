const clpVerSrv = require('../../services/clpVersion');
const createError = require('http-errors');

async function readMany(req, res){
  const filter = req.query, {projection} = req.queryAdvanced;
  const clpVerArr = await clpVerSrv.readMany(filter, projection);
  res.status(200).json(clpVerArr);
}

async function readOne(req, res){
  const filter = req.query, {projection} = req.queryAdvanced;
  const clpVer = await clpVerSrv.readOne(filter, projection);
  if(!clpVer) throw createError(404, 'CLP version not found');
  res.status(200).json(clpVer);
}

async function create(req, res){
  await clpVerSrv.create(req.body);
  res.status(200).end();
}

async function updateMany(req, res){
  const filter = req.query, updatedClpVer = req.bodyFlat;
  const result = await clpVerSrv.updateMany(filter, updatedClpVer);

  if(!result.acknowledged) throw createError(400, 'Bad CLP version Updating');

  res.status(204).end();
}

async function updateOne(req, res){
  const filter = req.query, updatedClpVer = req.bodyFlat;
  const result = await clpVerSrv.updateOne(filter, updatedClpVer);

  if(!result.acknowledged) throw createError(400, 'Bad CLP version Updating');
  if(result.matchedCount<1) throw createError(404, 'CLP version not found');

  res.status(204).end();
}

async function deleteOne(req, res){
  const filter = req.query;
  const {deletedCount} = await clpVerSrv.deleteOne(filter);
  if(deletedCount<1) throw createError(404, 'CLP version not found');
  res.status(204).end();
}

module.exports = {readMany, readOne, create, updateMany, updateOne, deleteOne};