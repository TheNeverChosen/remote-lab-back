const User = require('../models/user');
const verify = require('../utils/verify');

async function checkLogin(payload){
  const loginId = payload.loginId.trim(), {password} = payload;
  if(verify.isUsername(loginId)) return await User.findOne({username:loginId.trim(), password}, '_id');
  else if(verify.isEmail(loginId)) return await User.findOne({email:loginId.trim(), password}, '_id');
}

module.exports = {checkLogin};