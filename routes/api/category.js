const router = require('express').Router();
const categoryController = require('../../controllers/categoryController');

router.route('/')
  .get(categoryController.getParentCategories);

module.exports = router;