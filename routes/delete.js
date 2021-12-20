const router = require('express').Router();
const userCont = require('./controllers/user');
const authCont = require('./controllers/auth');

router.delete('/user/:id', authCont.checkAuthRole('MASTER'), userCont.remove);

module.exports = router;