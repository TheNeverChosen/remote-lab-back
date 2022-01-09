const router = require('express').Router();
const {noEmptyQuery} = require('./controllers/middles');
const clpCont = require('./controllers/clp');

router.get('/clp/many', clpCont.readMany);
router.get('/clp/', noEmptyQuery(), clpCont.readOne);

// router.post('/clp', clpCont.create); //automatic by arduino

router.put('/clp/many', clpCont.updateMany); //only Name
router.put('/clp', noEmptyQuery(), clpCont.updateOne); //only Name

router.delete('/clp/many', noEmptyQuery(), clpCont.deleteMany)
router.delete('/clp', noEmptyQuery(), clpCont.deleteOne);

module.exports = router;
