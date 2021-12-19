const router = require('express').Router();
const userCont = require('./controllers/user');
const authCont = require('./controllers/auth');

router.get('/user', userCont.readAll);
router.get('/user/:id', userCont.readById);

router.get('/logout', authCont.logout);

module.exports = router;