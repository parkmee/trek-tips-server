const db = require("../models");

module.exports = {
  getPlaces: function(req, res) {
    db.User
      .find({})
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  }
}