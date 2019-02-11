const router = require('express').Router();
const yelpController = require('../../controllers/yelpController');

router.route('/:id/recommendations')
  .post(yelpController.searchYelp);

  module.exports = router;