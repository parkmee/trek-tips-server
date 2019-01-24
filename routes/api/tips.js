const router = require('express').Router();
const tipsController = require('../../controllers/tipsController');

router.route('/:id')
  .get(tipsController.findUser);

module.exports = router;