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
      db.User
      .find({ _id: req.body.id })
      .lean()
      .populate("isSaved")
      .populate("hasVisited")
      .then(dbUser => {
        const savedPlaces = dbUser[0].isSaved;
        const visitedPlaces = dbUser[0].hasVisited;
        const matchingPlaces = [];
        const matchingPlacesId = [];
        const savedPlaceIds = [];
        const visitedPlaceIds = [];
        const filteredVisitedPlaces = [];

        // creates matchingPlaces array of places that are visited AND saved
        savedPlaces.forEach(sp => {
          visitedPlaces.forEach(vp => {
            if (sp.id === vp.id) {
              matchingPlaces.push(vp);
            }
          })
        })

        matchingPlaces.forEach(place => {
          matchingPlacesId.push(place.id);
        });

        savedPlaces.forEach(place => {
          if (!matchingPlacesId.includes(place.id)) {
            savedPlaceIds.push(place.id);
          }
        });

        visitedPlaces.forEach(place => {
          if (!matchingPlacesId.includes(place.id)) {
            visitedPlaceIds.push(place.id);
          }
        });

        const recommmendationsArray = [];
        recommendations.data.businesses.forEach(place => {
          if (matchingPlacesId.includes(place.id)) {
            recommmendationsArray.push({ place: place, isSaved: true, hasVisited: true })
            console.log("id:" + place.id + " name: " + place.name + " isSaved: true hasVisited: true");
          } else if (savedPlaceIds.includes(place.id)) {
            recommmendationsArray.push({ place: place, isSaved: true, hasVisited: false })
            console.log("id:" + place.id + " name: " + place.name + " isSaved: true hasVisited: false");
          } else if (visitedPlaceIds.includes(place.id)) {
            recommmendationsArray.push({ place: place, isSaved: false, hasVisited: true })
            console.log("id:" + place.id + " name: " + place.name + " isSaved: false hasVisited: true");
          } else {
            recommmendationsArray.push({ place: place, isSaved: false, hasVisited: false })
            console.log("id:" + place.id + " name: " + place.name + " isSaved: false hasVisited: false");
          }
        });

        res.json(recommmendationsArray);
      
      })
      .catch(err => res.status(422).json(err));
    })
    .catch(err => {
      console.log(err);
    })
  }
}