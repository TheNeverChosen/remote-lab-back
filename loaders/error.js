const {mongoose} = require('./mongo');
const createError = require('http-errors');

function errorNotFound(req, res, next){
  return next(createError(404, 'Nothing found'));
}

function errorMongo(err, req, res, next){
  if(err instanceof mongoose.Error){
    if(err instanceof mongoose.Error.ValidationError)
      return next(createError(400, err.message));
    else if(err instanceof mongoose.Error.CastError){
      const {kind, path} = err;
      if(kind=='ObjectId') return next(createError(404, 'Bad id'));
    }
    return next(createError(500, 'Something went wrong'));
  }
  return next(err);
}

function errorHandler(err, req, res, next){
  if(createError.isHttpError(err))
    res.status(err.status).json({message: err.message});
  else{
    console.log(err);
    res.status(500).json(err);
  }
}

module.exports = {errorHandler, errorMongo, errorNotFound};