const router = require('express').Router();
const getRouter = require('./get'),
  postRouter = require('./post'),
  putRouter = require('./put'),
  deleteRouter = require('./delete');

router.use(getRouter);
router.use(postRouter);
router.use(putRouter);
router.use(deleteRouter);

module.exports = router;