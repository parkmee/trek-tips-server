const axios = require("axios");
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

// connect to mongoose database
/* const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/trek-tips';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }); */

// Yelp endpoint URLs
const searchURL = `https://api.yelp.com/v3/businesses/search`;

module.exports = {
  // use to return recommended places based on location (required) and categories (optional)
  // location search string examples: "New York City", "NYC", "350 5th Ave, New York, NY 10118"
  // to filter for multiple categories: "bars,french" will filter by bars OR french
  // the category alias should be used for the search: https://www.yelp.com/developers/documentation/v3/all_category_list
  // see here for more info on business search parameters - https://www.yelp.com/developers/documentation/v3/business_search
  searchYelp: (req, res) => {
    const categories = req.body.categories; // change this - get names of stored preferences and from history
    const location = req.body.location;

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