const mongoose = require('../database/mongo');

const createError = require('http-errors');

function errorHandler(err, req, res, next){
  console.error(err);
  if(createError.isHttpError(err))
    res.status(err.status).json({message: err.message});
  else if(err instanceof mongoose.Error.ValidationError)
    res.status(400).json({message: 'Invalid data.'});
  else
    res.status(500).json(err);
}

module.exports = errorHandler;