const router = require('express').Router();
const userCont = require('./controllers/user');

router.delete('/user/:id', userCont.remove);

module.exports = router;