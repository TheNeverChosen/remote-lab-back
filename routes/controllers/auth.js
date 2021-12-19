const authSrv = require('../../services/auth');
const createErrror = require('http-errors');
const createError = require('http-errors');

async function login(req, res){
  const sess = req.session;
  if(sess.userId) throw createError(403, 'Forbidden Login: session ongoing')
  const user = await authSrv.checkLogin(req.body);
  if(!user) throw createErrror(401, 'Wrong login credentials');
  else console.log(`User id: ${user._id.toString()}`);
  sess.userId = user._id.toString();
  //sess.save();
  res.status(200).end();
}

async function logout(req, res){
  const sess = req.session;

  if(!sess.userId) throw createErrror(401, 'Unauthorized Logout: no session ongoing');

  console.log(`Terminating sessionId: ${sess.id} // userId: ${sess.userId}`);

  sess.destroy(err=>{
    if(err) throw err;
    res.status(200).end();
  });
}

module.exports = {login, logout};