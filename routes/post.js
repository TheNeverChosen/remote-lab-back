const router = require('express').Router();
const userCont = require('./controllers/user');
const authCont = require('./controllers/auth')

router.post('/user', userCont.create);
router.post('/login', authCont.login);

module.exports = router;