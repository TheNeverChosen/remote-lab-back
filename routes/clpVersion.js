const router = require('express').Router();
const clpVerCont = require('./controllers/clpVersion');

router.get('/clp-version/', clpVerCont.readOne);
router.get('/clp-version/all', clpVerCont.readAll);

router.post('/clp-version', clpVerCont.create);

router.put('/clp-version', clpVerCont.updateOne);
router.put('/clp-version/all', clpVerCont.updateAll);

router.delete('/clp-version', clpVerCont.deleteOne);

module.exports = router;