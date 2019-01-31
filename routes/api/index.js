const router = require('express').Router();
const tipsRoute = require('./tips');
const userRoute = require('./user');
const yelpRoute = require('./yelp');
const placeRoute = require('./place');

router.use('/tips', tipsRoute);
router.use('/user/', userRoute);
// note to team - added /user/:id prefix to the follow two routes
router.use('/user/:id/location', yelpRoute);
router.use('/user/:id/place', placeRoute);

module.exports = router;