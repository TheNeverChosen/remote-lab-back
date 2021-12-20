const {roleValues} = require('../../utils/env');
const authSrv = require('../../services/auth');
const createErrror = require('http-errors');
const createError = require('http-errors');
const {redisClient} = require('../../loaders/redis');

function isAuth(session){
  return session && session.userId ? true : false;
}

function checkNotAuth(req, res, next){
  if(!isAuth(req.session)) return next();
  return next(createError(403, 'Forbidden Login: session ongoing'));
}

function checkAuth(req, res, next){
  if(isAuth(req.session)) return next();
  return next(createErrror(401, 'Unauthorized: no session ongoing'));
}

function checkAuthRole(requiredRole){
  requiredRole = roleValues[requiredRole.trim().toUpperCase()];
  const setReqRole = (req, res, next) => {res.locals.reqRole = requiredRole; return next();};
  const checkRole = async (req, res, next) => {
    const session = req.session;
    if(!isAuth(session)) return next(createErrror(401, 'Unauthorized: no session ongoing'));
    console.log(session.userId)
    const {reqRole} = res.locals, userRole = await redisClient.get('61bf79fec71c6a6ebddf942c');
    console.log(reqRole + ' (req) < (user) ' + userRole + ' // '+await redisClient.keys('*'));
    if(reqRole < userRole) return next(createError(403, 'Forbidden: insufficient permission'));
    return next();
  }

  return [setReqRole, checkRole];
}

async function login(req, res){
  const sess = req.session;
  if(sess.userId) throw createError(403, 'Forbidden Login: session ongoing');
  const user = await authSrv.checkLogin(req.body);
  if(!user) throw createErrror(401, 'Wrong login credentials');
  sess.userId = user._id.toString();
  res.status(200).end();
}

async function logout(req, res){
  const sess = req.session;
  sess.destroy(err=>{
    if(err) throw err;
    res.status(200).end();
  });
}

module.exports = {checkAuth, checkNotAuth, checkAuthRole, login, logout};