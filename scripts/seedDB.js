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
      .then(seedPreferences())
      .catch(err => console.log(err));

  }

  seedPreferences() {
    const userArray = [];
    /* const preferencesArray = [
      "5c4c9c2bdd7cc490e0661062", // italian
      "5c4c9c2,bdd7cc490e0660ef5", // desserts
      "5c4c9c2bdd7cc490e066110c", // museums
      "5c4c9c2bdd7cc490e066116f", // parks
      "5c4c9c2bdd7cc490e06612c6", // sushi
      "5c4c9c2bdd7cc490e0660db7", // asianfusion
      "5c4c9c2bdd7cc490e0661079", // kids_activities
      "5c4c9c2bdd7cc490e0661097",
      "5c4c9c2bdd7cc490e0661393", // zoos
      "5c4c9c2bdd7cc490e0660da4", // arcades
      "5c4c9c2bdd7cc490e066110c"
    ]; */

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
          if (preferencesArray.length === preferencesStr.length) {
            
          }
        })
    })

    /* db.User.find({})
      .then(users => {
        users.forEach(user => {
          console.log(user._id);
          userArray.push(user._id);
        })
        console.log(userArray);
        userArray.forEach(userId => {
          const num1 = Math.floor(Math.random() * preferencesArray.length);
          const num2 = Math.floor(Math.random() * preferencesArray.length);

          db.User
            .findOneAndUpdate(
              userId, 
              { $push: 
                { preferences: 
                  { $each: [preferencesArray[num1], preferencesArray[num2]] }
                }
              }
            )
            .catch(err => console.log("preference update error: " + err));
        })
      })
      .catch(err => console.log("user fetch error: " + err));
 */
    /* db.User.find({})
      .then(function(users) {
        //console.log(users);
        users.forEach(user => {
          const num1 = Math.floor(Math.random() * preferencesArray.length);

          user.places.push(preferencesArray[num1])
          console.log(user.places);
        })
      
      }) */

    /* db.User
      .findByIdAndUpdate(userId, { $push: { preferences: categoryId } }, { new: true })
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err)); */
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
}

module.exports = SeedData;