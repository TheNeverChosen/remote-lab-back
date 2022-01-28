const plcProgSrv = require('../../services/plcProgram');

async function launchToArduino(req, res){
  const plcFilter = req.query, clientProtocol = req.body;
  const msg = await plcProgSrv.launchToArduino(plcFilter, clientProtocol)
  res.status(200).json(msg);
}

module.exports = {launchToArduino};