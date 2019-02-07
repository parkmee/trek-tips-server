const db = require("../models");
const differenceBy = require("lodash.differenceby");

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
    const query = { _id: req.params.id };
    const update = { preferences: req.params.categoryid };
    const options = { new: true };

    db.User
      .find({ _id: req.params.id, preferences: req.params.categoryid })
      .then(dbUser => {
        if (dbUser.length === 0) {
          console.log("no matches - adding new preference");
          db.User
            .findOneAndUpdate(query, { $push: update }, options)
            .then(dbUser => res.json(dbUser))
            .catch(err => res.status(422).json(err))
        } else {
          res.json(`Preference already saved by user - _id: ${req.params.categoryid}`);
        }
      })
      .catch(err => res.status(422).json(err));
  },
  // remove user preferences
  removeUserPreference: function (req, res) {
    const query = { _id: req.params.id };
    const update = { preferences: req.params.categoryid };
    const options = { new: true };

    db.User
      .findOneAndUpdate(query, { $pull: update }, options)
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // get user saved places and populate place info
  getUserSavedPlaces: function (req, res) {
    db.User
      .findById({ _id: req.params.id })
      .populate("isSaved")
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // remove user saved place
  removeUserSavedPlace: function (req, res) {
    const query = { _id: req.params.id };
    const update = { isSaved: req.params.place_id };
    const options = { new: true };

    db.User
      .findOneAndUpdate(query, { $pull: update }, options)
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // add user saved place - add to place collection if missing
  addUserSavedPlace: function (req, res) {
    const query1 = { id: req.body.id };
    const update1 = req.body;
    const options1 = { new: true, upsert: true };

    db.Place
      .findOneAndUpdate(query1, { $set: update1 }, options1)
      .then(dbPlace => {
        console.log(dbPlace);
        const query2 = { _id: req.params.id };
        const update2 = { isSaved: dbPlace._id };
        const options2 = { new: true };

        db.User
          .find({ _id: req.params.id, isSaved: dbPlace._id })
          .then(dbUser => {
            if (dbUser.length === 0) {
              console.log("no matches - adding new entry to saved places");
              db.User
                .findOneAndUpdate(query2, { $push: update2 }, options2)
                .then(dbUser => res.json(dbUser))
                .catch(err => res.status(422).json(err))
            } else {
              res.json(`Place already saved by user - _id: ${dbPlace._id}`);
            }
          })
          .catch(err => res.status(422).json(err));
      })
      .catch(err => res.status(422).json(err));
  },
  // get user visited places and populate place info
  getUserVisitedPlaces: function (req, res) {
    db.User
      .findById({ _id: req.params.id })
      .populate("hasVisited")
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // add user visited place - add to place collection if missing
  addUserVisitedPlace: function (req, res) {
    const query1 = { id: req.body.id };
    const update1 = req.body;
    const options1 = { new: true, upsert: true };

    db.Place
      .findOneAndUpdate(query1, { $set: update1 }, options1)
      .then(dbPlace => {
        console.log(dbPlace);
        const query2 = { _id: req.params.id };
        const update2 = { hasVisited: dbPlace._id };
        const options2 = { new: true };

        db.User
          .find({ _id: req.params.id, hasVisited: dbPlace._id })
          .then(dbUser => {
            if (dbUser.length === 0) {
              console.log("no matches - adding new entry to visited places");
              db.User
                .findOneAndUpdate(query2, { $push: update2 }, options2)
                .then(dbUser => res.json(dbUser))
                .catch(err => res.status(422).json(err))
            } else {
              res.json(`Place already visited by user - _id: ${dbPlace._id}`);
            }
          })
          .catch(err => res.status(422).json(err));
      })
      .catch(err => res.status(422).json(err));
  },
  // remove user visited place
  removeUserVisitedPlace: function (req, res) {
    const query = { _id: req.params.id };
    const update = { hasVisited: req.params.place_id };
    const options = { new: true };

    db.User
      .findOneAndUpdate(query, { $pull: update }, options)
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  getAllUserPlaces: function (req, res) {

    db.User
      .find({ _id: req.params.id })
      .populate("isSaved")
      .populate("hasVisited")
      .then(dbUser => {
        //res.json(dbUser);
        const savedPlaces = dbUser[0].isSaved;
        const visitedPlaces = dbUser[0].hasVisited;
        const matchingPlaces = [];
        const matchingPlacesId = [];
        const filteredVisitedPlaces = [];

        // creates matchingPlaces array of places that are visited AND saved
        // will use
        savedPlaces.forEach(sp => {
          visitedPlaces.forEach(vp => {
            if (sp.id === vp.id) {
              //console.log("match");
              matchingPlaces.push(vp);
            }
          })
        })
        console.log("mp", matchingPlaces.length);

        // ***********************************************************
        // THIS PART ABOVE IS WORKING
        // VARIOUS FAILED TRIES AT REMOVING MATCHED PLACES FROM THE SAVED AND VISITED PLACES 
        // ARRAYS FOLLOW

        /* matchingPlaces.forEach(place => {
          matchingPlacesId.push({ id: place.id });
        });
        console.log("mp id", matchingPlacesId);

        matchingPlacesId.forEach(id => {
          for (let i in savedPlaces) {
            const filtered = _.differenceBy(savedPlaces[i], id, "id");
            console.log("filtering");
          }
          res.json(filtered);
        }) */
        //const filtered = _.differenceBy(savedPlaces, "id")


        /* const filteredSavedPlaces = savedPlaces.filter(el => {
          return el.
        }) */
        /*  const filteredSavedPlaces = savedPlaces.map(sp => {
          console.log("check 1");
           console.log(sp.id, "*****************************");
          matchingPlaces.forEach(mp => {
            console.log(mp.id);
            if (sp.id === mp.id) {
              console.log("Match");
            } else {
              console.log(sp);
              return sp;
            }
          })
        })
        console.log(filteredSavedPlaces.length);
        console.log("hi");
         res.json(filteredSavedPlaces); */


        //console.log("mp", matchingPlaces.length);


        /* // created array of just the ids of matching places
        matchingPlaces.forEach(place => {
          matchingPlacesId.push({ id: place.id });
        });

        //const matchingPlacesId = matchingPlaces.map(place => place.id );
        console.log(matchingPlacesId)

        // NEED HELP FILTERING savedPlaces and visitedPlaces against matchingPlaces
        const filteredSavedPlaces = [];
        
          const filter = _.map(savedPlaces, val => {

          }) */
        /* 
                console.log(filteredSavedPlaces.length);
                console.log('hello');
                // HELP ABOVE THIS LINE
        
                const userStoredPlaces = [];
         */
        // ********************************************************************
        // THIS PART BELOW IS TESTED AND WORKED FINE
        // savedPlaces and visitedPlaces to be exchanged for their filtered versions
        // containing only unique values to each

        /* savedPlaces.forEach(place => {
          userStoredPlaces.push({ place: place, isSaved: true });
        });
        visitedPlaces.forEach(place => {
          userStoredPlaces.push({ place: place, hasVisited: true });
        });*/

        /* matchingPlaces.forEach(place => {
          userStoredPlaces.push({ place: place, isSaved: true, hasVisited: true })
        });
        console.log(userStoredPlaces);
        res.json(userStoredPlaces); */
      })
      .catch(err => res.status(422).json(err));

  }
};