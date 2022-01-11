const router = require('express').Router();
const wsCont = require('./controllers/ws');

module.exports = ()=>{
  router.ws('/arduino', wsCont.arduinoPlc);
  return router;
};