const router = require('express').Router();
const authRouter = require('./auth'),
  clpVerRouter = require('./clpVersion'),
  userRouter = require('./user');
const {advancedQuery, flattenBody} = require('./controllers/middles');

router.use(authRouter);
router.use(userRouter);
router.get('*', advancedQuery()); //sets req.advanced for advanced GET queries (projection, 'sort'...))
router.put('*', flattenBody());
router.use(clpVerRouter);

module.exports = router;