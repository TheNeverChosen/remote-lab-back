const router = require('express').Router();
const userCont = require('../controller/user');

router.get('/user', userCont.readAll);
router.get('/user/:id', userCont.read);

module.exports = router;