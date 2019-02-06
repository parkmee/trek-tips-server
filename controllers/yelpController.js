const axios = require("axios");
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const db = require("../models");

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
    const categories = req.body.categories;
    const location = req.body.location;
    const userId = req.body.id;
    
    axios.get(searchURL, {
      params: {
        categories: categories,
        location: location,
        userId: userId
      },
      headers: {
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
        'Access-Control-Allow-Headers': 'Origin'
      }
    }).then(recommendations => {
      for (let i = 0; i < recommendations.data.businesses.length; i++) {
        recommendations.data.businesses[i].isSaved = false;
        recommendations.data.businesses[i].hasVisited = false;

        db.User
          .findOne({ _id: userId, "places.place_id": recommendations.data.businesses[i].id})
          .select("places.isSaved places.hasVisited")
          .catch(err => {
            // dunno why but catch needs to be first here or it doesn't work right!
            res.json(recommendations.data); 
          })
          .then(result => {
            if (result) {
              recommendations.data.businesses[i].isSaved = result.places[0].isSaved;
              recommendations.data.businesses[i].hasVisited = result.places[0].hasVisited;
            } 
            res.json(recommendations.data); 
          });
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
}