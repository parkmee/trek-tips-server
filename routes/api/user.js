const router = require('express').Router();
const userController = require('../../controllers/userController');

router.route('/')
  .get(userController.getAllUsers);

router.route('/new')
  .post(userController.createUser);

router.route('/:id')
  .get(userController.findUserById);

router.route('/:id/category/:categoryid')
  .post(userController.addUserPreference)
  .delete(userController.removeUserPreference);

router.route('/:id/places/saved')
  .get(userController.getUserSavedPlaces)
  .post(userController.addUserSavedPlace);

router.route('/:id/places/saved/:place_id')
  .delete(userController.removeUserSavedPlace);

router.route('/:id/places/visited')
  .get(userController.getUserVisitedPlaces)
  .post(userController.addUserVisitedPlace);

router.route('/:id/places/visited/:placeid')
  .delete(userController.removeUserVisitedPlace);

module.exports = router;