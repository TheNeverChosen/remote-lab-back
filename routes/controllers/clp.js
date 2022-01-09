const clpSrv = require('../../services/clp');
const createError = require('http-errors');

async function readMany(req, res){
  const filter = req.query, {projection} = req.queryAdvanced;
  const clpArr = await clpSrv.readMany(filter, projection);
  res.status(200).json(clpArr);
}

async function readOne(req, res){
  const filter = req.query, {projection} = req.queryAdvanced;
  const clpVer = await clpSrv.readOne(filter, projection);
  if(!clpVer) throw createError(404, 'CLP not found');
  res.status(200).json(clpVer);
}

async function updateMany(req, res){
  const filter = req.query, updatedClpVer = req.bodyFlat;
  const result = await clpSrv.updateMany(filter, updatedClpVer);

  if(!result.acknowledged) throw createError(400, 'Bad CLP Updating');

  res.status(204).end();
}

async function updateOne(req, res){
  const filter = req.query, updatedClpVer = req.bodyFlat;
  const result = await clpSrv.updateOne(filter, updatedClpVer);

  if(!result.acknowledged) throw createError(400, 'Bad CLP Updating');
  if(result.matchedCount<1) throw createError(404, 'CLP not found');

  res.status(204).end();
}

async function deleteMany(req, res){
  const filter = req.query;
  await clpSrv.deleteMany(filter);
  res.status(204).end();
}

async function deleteOne(req, res){
  const filter = req.query;
  const {deletedCount} = await clpSrv.deleteOne(filter);
  if(deletedCount<1) throw createError(404, 'CLP not found');
  res.status(204).end();
}

module.exports = {readMany, readOne, updateMany, updateOne, deleteMany, deleteOne};
