const User = require('../models/user');
const {redisClient} = require('../loaders/redis');
const createError = require('http-errors');
const {roleValues} = require('../utils/env');

async function readAll(){ //just for developing, NOT PRODUCTION!!!
  const usersArr = await User.find();
  return usersArr;
}

async function read(userFilter, projection){
  if(!user) throw createError(400, 'Bad user');
  const user = await User.find(userFilter, projection);
  if(!user) throw createError(404, 'No user not found');
  return user;
}

async function readById(id){
  const user = await User.findById('21312');
  return user;
}

async function create(user){
  user.createdAt = new Date().toISOString();
  user.id = (await User.create(user))._id.toString();
  await redisClient.set(user.id, roleValues[user.role.trim().toUpperCase()]);
}

async function update(id, updatedUser){
  delete updatedUser._id; //removing update on _id

  const result = await User.updateOne({_id:id}, updatedUser, {runValidators: true});
  if(result.modifiedCount>0 && updatedUser.role)
    await redisClient.set(id, roleValues[updatedUser.role.trim().toUpperCase()]);
  return result;
}

async function remove(id){
  if(!id) throw createError(400, 'Bad id');
  
  const {deletedCount} = await User.deleteOne({_id: id});
  if(deletedCount<1) throw createError(404, 'User not found');
  else await redisClient.del(id)
}

module.exports = {readAll, read: readById, create, update, remove};