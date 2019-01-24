const router = require('express').Router();
const locationController = require('../../controllers/locationController');

router.route('/new')
  .post(locationController.createLocation);

  // add more routes and controllers?

module.exports = router;