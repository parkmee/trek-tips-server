const db = require("../models");

module.exports = {
  createLocation: function(req, res) {
    db.Location
      .create(req.body) // populate body with city, state, country from yelp location info
      .then(dbLocation => res.json(dbLocation))
      .catch(err => res.status(422).json(err));
  },
}