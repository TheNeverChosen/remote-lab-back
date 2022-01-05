const {mongoose} = require('./mongo');
const createError = require('http-errors');
const {env} = require('../utils/env');

function errorNotFound(req, res, next){
  return next(createError(404, 'Nothing found'));
}

function mongooseError(err){
  if(err instanceof mongoose.Error.ValidationError)
    return createError(400, err.message);
  else if(err instanceof mongoose.Error.CastError){
    const {kind, value, valueType, path} = err;
    return createError(404, `Expected type ${kind} at path \"${path}\". Received: \"${value}\" (type ${valueType})`);
  }
  else if(err instanceof mongoose.Error.StrictModeError)
    return createError(400, `Path \"${err.path}\" is not valid.`);
  return err;
}

function mongoServerError(err){
  if(err.code==11000) {
    const {keyValue} = err, dKey = Object.keys(keyValue)[0];
    return createError(400, `Duplicate error: \"${dKey}\" \"${keyValue[dKey]}\" already exists.`);
  }
  return err;
}

function errorMongo(err, req, res, next){
  if(err instanceof mongoose.Error) return next(mongooseError(err));
  else if(err instanceof mongoose.mongo.MongoServerError)
    return next(mongoServerError(err));
  return next(err);
}

function errorHandler(err, req, res, next){
  if(createError.isHttpError(err))
    return res.status(err.status).json({message: err.message});
  
  console.log('==========UNEXPECTED ERROR==========');
  console.log(err);

  if(env.NODE_ENV=='production')
    return res.status(500).json({message: 'Something went wrong'});

  return res.status(500).json(err);
}

module.exports = ()=>[errorNotFound, errorMongo, errorHandler];