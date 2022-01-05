const router = require('express').Router();
const authCont = require('./controllers/auth');

router.get('/auth', authCont.isAuth);
router.get('/auth/logout', authCont.checkAuthPermission(), authCont.logout);

router.post('/auth/login', authCont.checkNotAuth, authCont.login);

module.exports = router;