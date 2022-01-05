const router = require('express').Router();
const authRouter = require('./auth'),
  clpVerRouter = require('./clpVersion'),
  userRouter = require('./user');

router.use(authRouter);
router.use(clpVerRouter);
router.use(userRouter);

module.exports = router;