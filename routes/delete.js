const router = require('express').Router();
const userCont = require('../controller/user');

router.delete('/user/:id', userCont.remove);

module.exports = router;