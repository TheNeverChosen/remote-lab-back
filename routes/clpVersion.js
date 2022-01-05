const router = require('express').Router();
const {noEmptyQuery} = require('./controllers/middles');
const clpVerCont = require('./controllers/clpVersion');

router.get('/clp-version/', noEmptyQuery(), clpVerCont.readOne);
router.get('/clp-version/all', clpVerCont.readAll);

router.post('/clp-version', clpVerCont.create);

router.put('/clp-version', noEmptyQuery(), clpVerCont.updateOne);
router.put('/clp-version/all', clpVerCont.updateAll);

router.delete('/clp-version', noEmptyQuery(), clpVerCont.deleteOne);

module.exports = router;