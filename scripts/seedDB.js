const axios = require("axios");
const mongoose = require("mongoose");
const db = require("../models");
const fs = require("fs");
mongoose.set('useCreateIndex', true);

// connect to mongoose database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/trek-tips';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// category endpoint url to seed category collection
const categoriesURL = `https://api.yelp.com/v3/categories`;

// business search url and search parameters to seed places collection
const searchURL = `https://api.yelp.com/v3/businesses/search`;


// methods to seed data
class SeedData {
  /* constructor() {
    // leave blank
  } */

  seedUsers() {
    const userArray = require("./usertestdata.json");

    db.User
      .remove({})
      .then(() => db.User.collection.insertMany(userArray))
      .then(data => { console.log(data.result.n + " records inserted!"); })
      .catch(err => console.log(err));
  }

  // not in use
  seedPreferences() {
    const userArray = [];
    const preferencesArray = [];
    const preferencesStr = [
      "italian",
      "desserts",
      "museums",
      "parks",
      "sushi",
      "asianfusion",
      "kids_activities",
      "zoos",
      "arcade",
      "festivals",
      "korean",
      "sushi",
      "mexican"
    ];

    preferencesStr.forEach(preference => {
      db.Category
        .find({ "alias": preference })
        .then(category => {
          console.log(category);
          preferencesArray.push(category._id);
        })
    })

  }

  seedYelpPlaces() {
    const categories = "museums";
    const location = "Philadelphia, PA";

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

      db.Place.collection.insertMany(businesses)
        .then(data => { console.log(data.result.n + " records inserted!"); })
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

  convertCSVtoJSON() {
    // dependencies
    const csvToJson = require("convert-csv-to-json");
    const fileInputName = (__dirname + "/images.csv");
    const fileOutputName = (__dirname + "/images.json");

    // convert csv file to json
    csvToJson.fieldDelimiter(",").getJsonFromCsv(fileInputName);
    csvToJson.generateJsonFileFromCsv(fileInputName, fileOutputName);
  }

  seedImages() {
    const images = require("./images.json");

    db.Image
      .remove({})
      .then(() => db.Image.collection.insertMany(images))
      .then(data => { console.log(data.result.n + " records inserted!"); })
      .catch(err => console.log(err));
  }

  addImageToCategory() {
    db.Image
      .find({})
      .then(dbImage => {
        dbImage.forEach(image => {
          const query = { title: image.category };
          const update = { image_id: image._id };
          const options = { new: true };

          db.Category
            .findOneAndUpdate(query, update, options)
            .populate("image_id")
            .catch(err => console.log(err));
        })

        db.Category
          .find({})
          .then(dbCategory => console.log(dbCategory))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
}

module.exports = SeedData;