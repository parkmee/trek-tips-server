// const path = require('path');
const router = require('express').Router();
const apiRoutes = require('./api');

// API Routes
router.use("/api", apiRoutes);

/* router.use((req, res) => {
  res.sendFile(path.join(__dirname, "not sure what to put here"))
}) */

module.exports = router;