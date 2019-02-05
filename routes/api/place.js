const router = require('express').Router();
const placeController = require('../../controllers/placeController');

router.route('/:id')
  .delete(placeController.deletePlace);

router.route('/add')
  .get(placeController.addPlace)
  .post(placeController.addPlace);

module.exports = router;