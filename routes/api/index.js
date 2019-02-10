const router = require('express').Router();
const tipsRoute = require('./tips');
const userRoute = require('./user');
const yelpRoute = require('./yelp');
const placeRoute = require('./place');
const preferencesRoute = require('./category');

router.use('/tips', tipsRoute);
router.use('/user', userRoute);
router.use('/user/:id/recommendations', yelpRoute);
router.use('/place', placeRoute);
router.use('/preferences', preferencesRoute);

module.exports = router;