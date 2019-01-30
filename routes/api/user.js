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

router.route('/:id/location/add')
  .post(userController.addUserLocation);

module.exports = router;