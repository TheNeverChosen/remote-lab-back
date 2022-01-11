const router = require('express').Router();
const {noEmptyQuery} = require('./controllers/middles');
const plcCont = require('./controllers/plc');

module.exports = ()=>{
  router.get('/plc/many', plcCont.readMany);
  router.get('/plc/', noEmptyQuery(), plcCont.readOne);

  // router.post('/plc', plcCont.create); //automatic by arduino

  router.put('/plc/many', plcCont.updateMany); //only Name
  router.put('/plc', noEmptyQuery(), plcCont.updateOne); //only Name

  router.delete('/plc/many', plcCont.deleteMany)
  router.delete('/plc', noEmptyQuery(), plcCont.deleteOne);

  return router;
};
