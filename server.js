// Dependencies ---------------------------------------------------------------
require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');

// Dev Dependencies -----------------------------------------------------------
// const logger = require('morgan');

// Connect to MongoDB Database ------------------------------------------------
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/trek-tips';
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.once('open', () =>{
  console.log("we're connected");
})
mongoose.Promise = global.Promise;

// Initialize http server -----------------------------------------------------
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware -----------------------------------------------------------------
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes ---------------------------------------------------------------------
app.use('/', routes);

// Seed Data ------------------------------------------------------------------
const SeedData = require('./scripts/seedDB');
const seed = new SeedData();
// enable the methods below to reseed as needed
// RUN IN ORDER, ONE AT A TIME, OR YOU WILL HAVE DUPLICATION OF DATA (IF RUNNING IN WATCH MODE)
// seed.seedYelpCategories(); // master list of all Yelp category items
// seed.seedYelpPlaces(); // dummy place data retrieved from Yelp
<<<<<<< HEAD
// seed.seedUsers(); // dummy user data from json
//seed.convertCSVtoJSON(); // create json file of image links
//seed.seedImages(); // upload image json file as collection
//seed.seedPreferences();
=======
// seed.seedUsers(); // dummy user data from json 

// DO NOT RUN
// seed.seedPreferences();
// seed.convertCSVtoJSON(); // create json file of image links
// seed.seedImages(); // upload image json file as collection
>>>>>>> bf2f3878343c7f58f083f4c37d7a42d6a7feb200

// launch server --------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
