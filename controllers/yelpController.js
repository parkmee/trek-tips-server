const axios = require("axios");
const mongoose = require("mongoose");
const db = require("../models");
mongoose.set('useCreateIndex', true);

// connect to mongoose database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/trek-tips';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Yelp endpoint URLs
const categoriesURL = `https://api.yelp.com/v3/categories`;
const searchURL = `https://api.yelp.com/v3/businesses/search`;

module.exports = {
  // run to return categories from Yelp and to populate category collection
  // only needs to be run one time to populate database
  getCategories: () => {
    axios.get(categoriesURL, {
      headers: {
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
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
  },
  
  // use to return recommended places based on location (required) and categories (optional)
  // location search string examples: "New York City", "NYC", "350 5th Ave, New York, NY 10118"
  // to filter for multiple categories: "bars,french" will filter by bars OR french
  // the category alias should be used for the search: https://www.yelp.com/developers/documentation/v3/all_category_list
  // see here for more info on business search parameters - https://www.yelp.com/developers/documentation/v3/business_search
  searchYelp: (location, categories) => {
    axios.get(searchURL, {
      params: {
        categories: categories,
        location: location
      },
      headers: {
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
        'Access-Control-Allow-Headers': 'Origin'
      }
    }).then(recommendations => {
      console.log(recommendations.data);
      res.json(recommendations.data);
    })
      .catch(err => {
        console.log(err);
      })
  }
}