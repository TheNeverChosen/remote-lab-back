const router = require('express').Router();
const {noEmptyQuery} = require('./controllers/middles');
const plcProgCont = require('./controllers/plcProgram');

module.exports = ()=>{
  router.post('/plc/program', noEmptyQuery(), plcProgCont.launchToArduino);

  return router;
};