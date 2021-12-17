const userModel = require('../model/user');

async function readAll(req, res){
  const usersArr = await userModel.readAll();
  res.status(200).json(usersArr);
}

async function read(req, res){
  const id = req.params.id;
  const user = await userModel.read(id);
  res.status(200).json(user);
}

async function create(req, res){
  await userModel.create(req.body);
  res.status(201).end();
}

async function update(req, res){
  const id = req.params.id, user = req.body;
  await userModel.update(id, user);
  res.status(200).end();
}

async function remove(req, res){
  await userModel.remove(req.params.id);
  res.status(200).end();
}

module.exports = {readAll, read, create, update, remove};