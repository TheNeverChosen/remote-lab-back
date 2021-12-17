const User = require('../database/schema/user');
const redisClient = require('../database/redis');
const createError = require('http-errors');

async function readAll(){ //just for developing, NOT PRODUCTION!!!
  const usersArr = await User.find();
  return usersArr;
}

async function read(id){
  if(!id) throw createError(400, 'Bad user id');
  
  const user = await User.findById(id);
  if(!user) throw createError(404, 'User not found');
  return user;
}

async function create(user){
  user.id = (await User.create(user))._id.toString();
  await redisClient.set(user.id, user.role);
}

async function update(id, updatedUser){
  delete updatedUser._id; //removing update on _id

  const result = await User.updateOne({_id:id}, updatedUser);
  
  if(!result.acknowledged) throw createError(500, 'Error while updating user');
  if(result.matchedCount!=1) throw createError(404, 'User not found');
  if(result.modifiedCount>0 && updatedUser.role)
    await redisClient.set(id, updatedUser.role);
}

async function remove(id){
  if(!id) throw createError(400, 'Bad id');
  
  const {deletedCount} = await User.deleteOne({_id: id});
  if(deletedCount<1) throw createError(404, 'User not found');
  else await redisClient.del(id)
}

module.exports = {readAll, read, create, update, remove};