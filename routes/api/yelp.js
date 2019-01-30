const router = require('express').Router();
const yelpController = require('../../controllers/yelpController');

router.route('/')
  .get(yelpController.searchYelp);

  module.exports = router;