const router = require('express').Router();
const userCont = require('./controllers/user');
const authCont = require('./controllers/auth');

router.get('/user', /*authCont.checkAuthRole('MASTER'),*/ userCont.readAll);
router.get('/user/:id', userCont.readById);
router.get('/auth/logout', authCont.checkAuthPermission(), authCont.logout);

module.exports = router;