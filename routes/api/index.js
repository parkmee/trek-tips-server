const router = require('express').Router();
const tipsRoute = require('./tips');
const userRoute = require('./user');

router.use('/tips', tipsRoute);
router.use('/user', userRoute);

module.exports = router;