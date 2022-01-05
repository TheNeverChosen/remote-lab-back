const router = require('express').Router();
const authRouter = require('./auth'),
  clpVerRouter = require('./clpVersion'),
  userRouter = require('./user');
const {advancedQuery} = require('../loaders/mongo');


router.get('*', advancedQuery()); //sets req.advanced for advanced GET queries (projection, 'sort'...))
router.use(authRouter);
router.use(clpVerRouter);
router.use(userRouter);

module.exports = router;