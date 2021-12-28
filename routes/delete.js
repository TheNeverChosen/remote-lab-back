const router = require('express').Router();
const userCont = require('./controllers/user');
const authCont = require('./controllers/auth');

router.delete('/user/:id', /*authCont.checkAuthPermission(),*/ userCont.remove);

module.exports = router;