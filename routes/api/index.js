const router = require('express').Router();
const tipsRoute = require('./tips');
const userRoute = require('./user');
const yelpRoute = require('./yelp');

router.use('/tips', tipsRoute);
router.use('/user', userRoute);
router.use('/recommendations', yelpRoute);

module.exports = router;