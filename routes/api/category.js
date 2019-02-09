const router = require('express').Router();
const categoryController = require('../../controllers/categoryController');

router.route('/')
  .get(categoryController.getParentCategories);

router.route('/:parentCategory')
  .get(categoryController.getChildCategories);

router.route('/get/:categoryAlias')
  .get(categoryController.getOneCategory);

module.exports = router;