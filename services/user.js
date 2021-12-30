const User = require('../models/user');
const {redisClient} = require('../loaders/redis');
const createError = require('http-errors');
const {roles} = require('../utils/env');
const verify = require('../utils/verify');

async function readAll(){ //just for developing, NOT PRODUCTION!!!
  const usersArr = await User.find();
  return usersArr;
}

async function readMany(userFilter, projection){
  if(!userFilter) throw createError(400, 'Bad user filter');
  return await User.find(userFilter, projection);
}

async function readOne(userFilter, projection){
  if(!userFilter) throw createError(400, 'Bad user filter');
  return await User.findOne(userFilter, projection);
}

async function readById(id){
  if(!verify.isObjectId(id)) throw createError(400, 'Bad user id');
  return await User.findById(id);
}


async function create(user){
  user.createdAt = new Date().toISOString();
  user.id = (await User.create(user))._id.toString();
  await redisClient.set(user.id, verify.roleToNumber(user.role));
}

async function updateById(id, updatedUser){
  if(!verify.isObjectId(id)) throw createError(400, 'Bad user id');

  delete updatedUser._id; //removing update on _id
  delete updatedUser.createdAt; //removing update on createdAt

  const result = await User.updateOne({_id:id}, updatedUser, {runValidators: true});
  if(result.modifiedCount>0 && updatedUser.role)
    await redisClient.set(id, verify.roleToNumber(updatedUser.role));
  return result;
}

async function removeById(id){
  if(!verify.isObjectId(id)) throw createError(400, 'Bad user id');
  
  const {deletedCount} = await User.deleteOne({_id: id});
  if(deletedCount>=1) await redisClient.del(id);

  return deletedCount;
}

module.exports = {create, readAll, readMany, readOne, readById, updateById, removeById};