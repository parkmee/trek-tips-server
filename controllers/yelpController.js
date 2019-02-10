const axios = require("axios");
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const db = require("../models");

// Yelp endpoint URLs
const searchURL = `https://api.yelp.com/v3/businesses/search`;

module.exports = {
  // return recommended places based on location (required) and categories (optional)
  // location search string examples: "New York City", "NYC", "350 5th Ave, New York, NY 10118"
  // to filter for multiple categories: "bars,french" will filter by bars OR french
  // the category alias should be used for the search: https://www.yelp.com/developers/documentation/v3/all_category_list
  // see here for more info on business search parameters - https://www.yelp.com/developers/documentation/v3/business_search
  searchYelp: (req, res) => {
    const categories = req.body.categories;
    const location = req.body.location;
    const userId = req.params.id;

    axios.get(searchURL, {
      params: {
        // userId: userId, // not sure this is needed for axios call to Yelp
        categories: categories,
        location: location
      },
      headers: {
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
        'Access-Control-Allow-Headers': 'Origin'
      }
    })
    .then(response => {
      const places = response.data.businesses;

      // get user saved and visited place info
      db.User
        .find({ _id: userId })
        .lean()
        .populate("isSaved")
        .populate("hasVisited")
        .then(dbUser => {
          const savedPlaces = dbUser[0].isSaved;
          const visitedPlaces = dbUser[0].hasVisited;
          const matchingPlaces = [];
          const matchingPlacesYelpId = [];
          const savedPlacesYelpId = [];
          const visitedPlacesYelpId = [];
          const recommendationsArray = [];

          // create matchingPlaces array of places that were visited AND saved
          // create array of IDs of places that were visited AND saved
          savedPlaces.forEach(sp => {
            visitedPlaces.forEach(vp => {
              if (sp.id === vp.id) {
                matchingPlaces.push(vp);
                matchingPlacesYelpId.push(vp.id)
              }
            })
          })

          // create array of saved place IDs, excepting places that are also visited
          savedPlaces.forEach(place => {
            if (!matchingPlacesYelpId.includes(place.id)) {
              savedPlacesYelpId.push(place.id);
            }
          })

          // create array of visited place IDs, excepting places that are also saved
          visitedPlaces.forEach(place => {
            if (!matchingPlacesYelpId.includes(place.id)) {
              visitedPlacesYelpId.push(place.id);
            }
          })

          // for each yelp result, compare against list of matched, saved, and visited places
          // to apply appropriate true/false flag, and to store in recommendations array
          places.forEach(place => {
            if (matchingPlacesYelpId.includes(place.id)) {
              recommendationsArray.push({ place: place, isSaved: true, hasVisited: true })
              console.log(`yelpID: ${place.id}, name: ${place.name}, isSaved: true, hasVisited: true`);
            } else if (savedPlacesYelpId.includes(place.id)) {
              recommendationsArray.push({ place: place, isSaved: true, hasVisited: false })
              console.log(`yelpID: ${place.id}, name: ${place.name}, isSaved: true, hasVisited: false`);
            } else if (visitedPlacesYelpId.includes(place.id)) {
              recommendationsArray.push({ place: place, isSaved: false, hasVisited: true })
              console.log(`yelpID: ${place.id}, name: ${place.name}, isSaved: false, hasVisited: true`);
            } else {
              recommendationsArray.push({ place: place, isSaved: false, hasVisited: false })
              console.log(`yelpID: ${place.id}, name: ${place.name}, isSaved: false, hasVisited: false`);
            }
          })

          res.json(recommendationsArray);
        })
        .catch(err => res.status(422).json(err));
    })
    .catch(err => res.status(422).json(err));
  }
}