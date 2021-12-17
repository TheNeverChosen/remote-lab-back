const router = require('express').Router();
const userCont = require('../controller/user');

router.post('/user', userCont.create);

module.exports = router;