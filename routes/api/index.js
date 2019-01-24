const router = require('express').Router();
const tipsRoute = require('./tips');
const userRoute = require('./user');
const locationRoute = require('./location');

router.use('/tips', tipsRoute);
router.use('/user', userRoute);
router.use('/location', locationRoute);

module.exports = router;