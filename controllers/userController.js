const db = require("../models");

// methods for userController
module.exports = {
  // create user - disable if using Auth0 for login
  createUser: function (req, res) {
    db.User
      .create(req.body)
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // get all users
  getAllUsers: function (req, res) {
    db.User
      .find({})
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // get user by ID and populate preferences
  findUserById: function (req, res) {
    db.User
      .findById({ _id: req.params.id })
      .populate("preferences")
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // add user preferences
  addUserPreference: function (req, res) {
    const categoryId = req.params.categoryid;
    const userId = req.params.id;

    db.User
      .findByIdAndUpdate(userId, { $push: { preferences: categoryId } }, { new: true })
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // remove user preferences
  removeUserPreference: function (req, res) {
    const categoryId = req.params.categoryid;
    const userId = req.params.id;

    db.User
      .findByIdAndUpdate(userId, { $pull: { preferences: categoryId } })
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // need to test once places can be added
  getUserSavedPlaces: function (req, res) {
    db.User
      .findById({ _id: req.params.id })
      .where({ "places.isSaved": true })
      .populate("places.place_id")
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // TODO - NEED HELP WITH THIS
  // THROWING POST ERROR: "The field 'places' must be an array but is of type object in document {_id: ObjectId('5c55e37dd60b190948453c08')}"
  // Using POST test message: http://192.168.2.195:8000/api/user/5c55e37dd60b190948453c08/places/saved/atlanta+ga
  addUserSavedPlace: function (req, res) { 
    const userId = req.params.id;
    const locationSearchStr = req.params.location; // location search string from yelp search
    const placeAlias = { "name": req.body.alias }; // req body from yelp search

    // WORKING - Upon saving place, a new place document will be added to the place
    // collection if it does not already exist
    db.Place
      .find(placeAlias)
      .then(dbPlace => {
        if (dbPlace.length === 0) {
          console.log("adding new place");
          db.Place
            .create(req.body)
            .then(dbPlace => res.json(dbPlace))
            .catch(err => res.status(422).json(err));
        } else {
          console.log("record exists");
          res.json(dbPlace);
        }
        // THIS IS WHERE THE ERROR OCCURS
        console.log("ready for inserting ref into user record");
        db.User
          .findByIdAndUpdate(userId, { 
            $push: {
              "places": {
                place_id: dbPlace._id,
                isSaved: true,
                locationSearchString: locationSearchStr,
                alias: dbPlace.alias,
                name: dbPlace.name
              }
            } 
          }, { new: true })
          .then(dbUser => res.json(dbUser))
          .catch(err => res.status(422).json(err));
      })
      .catch(err => res.status(422).json(err));
  },
  getUserVisitedPlaces: function (req, res) {
    db.User
      .findById({ _id: req.params.id })
      .where({ "places.hasVisited": true })
      .populate("places_id")
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // TO DO - SAME ERROR AS ABOVE
  addUserVisitedPlace: function (req, res) {
    const userId = req.params.id;
    const locationSearchStr = req.params.location; // location search string from yelp search
    const placeAlias = { "name": req.body.alias }; // req body from yelp search

    // WORKING - Upon saving place, a new place document will be added to the place
    // collection if it does not already exist
    db.Place
      .find(placeAlias)
      .then(dbPlace => {
        if (dbPlace.length === 0) {
          console.log("adding new place");
          db.Place
            .create(req.body)
            .then(dbPlace => res.json(dbPlace))
            .catch(err => res.status(422).json(err));
        } else {
          console.log("record exists");
          res.json(dbPlace);
        }
        // THIS IS WHERE THE ERROR OCCURS
        console.log("ready for inserting ref into user record");
        db.User
          .findByIdAndUpdate(userId, { 
            $push: {
              "places": {
                place_id: dbPlace._id,
                hasVisited: true, // this is the only difference from above
                locationSearchString: locationSearchStr,
                alias: dbPlace.alias,
                name: dbPlace.name
              }
            } 
          }, { new: true })
          .then(dbUser => res.json(dbUser))
          .catch(err => res.status(422).json(err));
      })
      .catch(err => res.status(422).json(err));
  },
  removeUserSavedPlace: function (req, res) {
    const userId = req.params.id;
    const placeId = req.params.placeid;

    db.User
      .findByIdAndUpdate(userId, { "places.isSaved": false })
      .where({ "places.place_id": placeId })
      .then(dbUser => {
        if ("places.hasVisited" === false) {
          db.User
            findByIdAndUpdate(userId, { 
              $pull: { places: { place_id: placeId } }
            })
            .then(dbUser2 => res.json(dbUser2))
            .catch(err => res.status(422).json(err));
        } else {
          res.json(dbUser);
        }
      })
      .catch(err => res.status(422).json(err));
  },
  removeUserVisitedPlace: function (req, res) {
    const userId = req.params.id;
    const placeId = req.params.placeid;

    db.User
      .findByIdAndUpdate(userId, { "places.hasVisited": false })
      .where({ "places.place_id": placeId })
      .then(dbUser => {
        if ("places.isSaved" === false) {
          db.User
            findByIdAndUpdate(userId, { 
              $pull: { places: { place_id: placeId } }
            })
            .then(dbUser2 => res.json(dbUser2))
            .catch(err => res.status(422).json(err));
        } else {
          res.json(dbUser);
        }
      })
      .catch(err => res.status(422).json(err));
  }
};