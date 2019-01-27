// Dependencies ---------------------------------------------------------------
require('dotenv').config();
const express = require("express");
const routes = require('./routes');
const bodyParser = require("body-parser");
const logger = require('morgan');
const http = require("http");
const fs = require("fs");

// Connect to MongoDB Database ------------------------------------------------
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/trek-tips';
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
const db = mongoose.connection;

db.on("error", mes => {
  console.log("db connection failed");
});

db.once("open", () => {
  console.log("db connected successfully");
});

// Initialize http server -----------------------------------------------------
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware -----------------------------------------------------------------
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// not sure if this might be needed for yelp api
/* app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
  }); */

// Routes ---------------------------------------------------------------------
app.use("/", routes);



// Seed Data ------------------------------------------------------------------
const SeedData = require("./scripts/seedDB");
const seed = new SeedData();
// enable the methods below to reseed as needed
// seed.seedYelpCategories(); // master list of all Yelp category items
// seed.seedYelpPlaces(); // dummy place data retrieved from Yelp
// seed.seedUsers(); // dummy user data from json

// launch server --------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
