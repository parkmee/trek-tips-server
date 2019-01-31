const router = require('express').Router();
const placeController = require('../../controllers/placeController');


router.route('/savedplaces')
  .post(placeController.savePlace)
  .get(placeController.getSavedPlaces)
  .update(placeController.unSavePlace);

router.route('/visitedplaces')
  .post(placeController.visitPlace)
  .get(placeController.getVisitedPlaces)
  .update(placeController.placeNotVisited);

module.exports = router;