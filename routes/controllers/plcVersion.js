const plcVerSrv = require('../../services/plcVersion');
const createError = require('http-errors');

async function readMany(req, res){
  const filter = req.query, {projection} = req.queryAdvanced;
  const plcVerArr = await plcVerSrv.readMany(filter, projection);
  res.status(200).json(plcVerArr);
}

async function readOne(req, res){
  const filter = req.query, {projection} = req.queryAdvanced;
  const plcVer = await plcVerSrv.readOne(filter, projection);
  if(!plcVer) throw createError(404, 'PLC version not found');
  res.status(200).json(plcVer);
}

async function create(req, res){
  await plcVerSrv.create(req.body);
  res.status(200).end();
}

async function updateMany(req, res){
  const filter = req.query, updatedPlcVer = req.bodyFlat;
  const result = await plcVerSrv.updateMany(filter, updatedPlcVer);

  if(!result.acknowledged) throw createError(400, 'Bad PLC version Updating');

  res.status(204).end();
}

async function updateOne(req, res){
  const filter = req.query, updatedPlcVer = req.bodyFlat;
  const result = await plcVerSrv.updateOne(filter, updatedPlcVer);

  if(!result.acknowledged) throw createError(400, 'Bad PLC version Updating');
  if(result.matchedCount<1) throw createError(404, 'PLC version not found');

  res.status(204).end();
}

function setDelPlc(req, res, next){
  req.delDependents = (req.query.delDependents==='true');
  delete req.query.delDependents;
  next();
}

async function deleteMany(req, res){
  const {query: filter, delDependents} = req;
  await plcVerSrv.deleteMany(filter, delDependents);
  res.status(204).end();
}

async function deleteOne(req, res){
  const {query: filter, delDependents} = req;
  const {deletedCount} = await plcVerSrv.deleteOne(filter, delDependents);
  if(deletedCount<1) throw createError(404, 'PLC version not found');
  res.status(204).end();
}

module.exports = {readMany, readOne, create, updateMany, deleteMany, setDelPlc, updateOne, deleteOne};