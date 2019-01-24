// Dependencies ---------------------------------------------------------------
const express = require("express");
const routes = require('./routes');
const bodyParser = require("body-parser");
const logger = require('morgan');
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

// Initialize http server -----------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware -----------------------------------------------------------------
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes ---------------------------------------------------------------------
app.use(routes);

// Connect to MongoDB Database ------------------------------------------------
/*const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/trek-tips';
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});*/

// launch server --------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
