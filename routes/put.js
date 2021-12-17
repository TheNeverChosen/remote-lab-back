const router = require('express').Router();
const userCont = require('../controller/user');

router.put('/user/:id', userCont.update);

module.exports = router;