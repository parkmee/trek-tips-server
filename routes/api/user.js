const router = require('express').Router();
const userController = require('../../controllers/userController');

router.route('/new')
  .post(userController.createUser);

router.route('/:id')
  .get(userController.findUserById);

router.route('/:id/category/:categoryid')
  .post(userController.addUserPreference)
  .delete(userController.removeUserPreference);

module.exports = router;