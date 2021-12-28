const router = require('express').Router();
const userCont = require('./controllers/user');
const authCont = require('./controllers/auth');

router.put('/user/:id', /*authCont.checkAuthPermission('MASTER'),*/ userCont.update);

module.exports = router;