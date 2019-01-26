const axios = require("axios");
const mongoose = require("mongoose");
const db = require("../models");
const userArray = require("../data/usertestdata.json");
const locationArray = require("../data/locationtestdata.json");
mongoose.set('useCreateIndex', true);

// connect to mongoose database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/trek-tips';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// category endpoint url to seed category collection
const categoriesURL = `https://api.yelp.com/v3/categories`;

// business search url and search parameters to seed places collection
const searchURL = `https://api.yelp.com/v3/businesses/search`;
const categories = "desserts";
const location = "atlanta, ga"

// methods to seed data
class SeedData {
  /* constructor() {
    // leave blank
  } */

  seedUsers() {
    db.User
      .remove({})
      .then(() => db.User.collection.insertMany(userArray))
      .then(data => { console.log(data.result.n + " records inserted!"); })
      .catch(err => console.log(err));
  }

  seedYelpPlaces() {
    // seed place data
    axios.get(searchURL, {
      params: {
        categories: categories,
        location: location,
        limit: 5
      },
      headers: {
        'Authorization': `Bearer lC3zgwezYWCKbJZW03Yepl4A52o_fhrqd9a1x0_MapVxItu97aAHOUOGfsRzDJswOWzWlaHv0zvw8keaePumFEkXJWyOgcTcLg7ekQOQ9skybUd_wy02lE3hnQy0W3Yx`,
        'Access-Control-Allow-Headers': 'Origin'
      }
    }).then(res => {
      console.log(res.data.businesses);
      const businesses = res.data.businesses;

      db.Category
        .remove({})
        .then(() => db.Place.collection.insertMany(businesses))
        .then(data => {
          console.log(data.result.n + " records inserted!");
        })
        .catch(err => {
          console.log(`Mongoose error: ${err}`);
          process.exit(1);
        });
    })
      .catch(err => {
        console.log(`API error: ${err}`);
      });
  }

  seedYelpCategories() {
    axios.get(categoriesURL, {
      headers: {
        'Authorization': `Bearer lC3zgwezYWCKbJZW03Yepl4A52o_fhrqd9a1x0_MapVxItu97aAHOUOGfsRzDJswOWzWlaHv0zvw8keaePumFEkXJWyOgcTcLg7ekQOQ9skybUd_wy02lE3hnQy0W3Yx`,
        'Access-Control-Allow-Headers': 'Origin'
      }
    }).then(res => {
      console.log(res.data.categories);
      const categories = res.data.categories;

      db.Category
        .remove({})
        .then(() => db.Category.collection.insertMany(categories))
        .then(data => {
          console.log(data.result.n + " records inserted!");
          process.exit(0);
        })
        .catch(err => {
          console.log(`Mongoose error: ${err}`);
          process.exit(1);
        });
    })
      .catch(err => {
        console.log(`API error: ${err}`);
      });
  }
}

module.exports = SeedData;