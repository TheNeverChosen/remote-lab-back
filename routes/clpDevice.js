const router = require('express').Router();
const {noEmptyQuery} = require('./controllers/middles');
const clpDevCont = require('./controllers/clpDevice');

router.post('/clp/devices/:io/:type', noEmptyQuery(), clpDevCont.addOneDevice); //push 1 device to array
router.delete('clp/devices/:io/:type', noEmptyQuery(), clpDevCont.deleteDevices); //delete devices from array

module.exports = router;