const clpSrv = require('../../services/clp');
const createError = require('http-errors');

async function addOneDevice(req, res){ //push 1 device to array
  const filter = req.query, {io, type} = req.params, newDev = req.bodyFlat;
  const result = await clpSrv.addOneDevice(filter, io, type, newDev);
  res.status(200).end();
}

async function deleteDevices(req, res){ //delete devices from array
  
  res.status(404).end(); 
}

module.exports = {addOneDevice, deleteDevices};