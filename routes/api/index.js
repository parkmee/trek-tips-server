const router = require('express').Router();
const tipsRoute = require('./tips');
const userRoute = require('./user');
const yelpRoute = require('./yelp');
const placeRoute = require('./place');

router.use('/tips', tipsRoute);
router.use('/user', userRoute);
router.use('/recommendations', yelpRoute);
router.use('/place');

module.exports = router;