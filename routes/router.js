const router = require('express').Router();
const authRouter = require('./auth'),
  userRouter = require('./user'),
  clpRouter = require('./clp'),
  clpVerRouter = require('./clpVersion'),
  clpDevRouter = require('./clpDevice');
const {advancedQuery, flattenBody} = require('./controllers/middles');

router.use(authRouter);
router.use(userRouter);
router.get('*', advancedQuery()); //sets req.advanced for advanced GET queries (projection, 'sort'...))
router.put('*', flattenBody());   //flats req.body of PUT requests
router.use(clpRouter);
router.use(clpVerRouter);
router.use(clpDevRouter);

module.exports = router;