const router = require('express').Router();
const userCont = require('./controllers/user');
const authCont = require('./controllers/auth')

router.post('/user', /*authCont.checkAuthRole('MASTER'),*/ userCont.create);
router.post('/login', authCont.checkNotAuth, authCont.login);

module.exports = router;