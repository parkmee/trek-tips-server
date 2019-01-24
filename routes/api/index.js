const router = require('express').Router();
const tipsRoute = require('./tips');

router.use('/tips', tipsRoute);

module.exports = router;