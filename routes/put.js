const router = require('express').Router();
const userCont = require('./controllers/user');

router.put('/user/:id', userCont.update);

module.exports = router;