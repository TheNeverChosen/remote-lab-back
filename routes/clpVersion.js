const router = require('express').Router();
const {noEmptyQuery} = require('./controllers/middles');
const clpVerCont = require('./controllers/clpVersion');

router.get('/clp-version/many', clpVerCont.readAll);
router.get('/clp-version/', noEmptyQuery(), clpVerCont.readOne);

router.post('/clp-version', clpVerCont.create);

router.put('/clp-version/many', clpVerCont.updateAll);
router.put('/clp-version', noEmptyQuery(), clpVerCont.updateOne);

router.delete('/clp-version', noEmptyQuery(), clpVerCont.deleteOne);

module.exports = router;