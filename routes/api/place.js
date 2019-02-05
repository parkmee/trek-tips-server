const router = require('express').Router();
const placeController = require('../../controllers/placeController');

router.route('/:id')
  .delete(placeController.deletePlace);

module.exports = router;