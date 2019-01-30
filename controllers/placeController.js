const db = require("../models");

module.exports = {
  findByLocation: function(req, res) {
    db.Place
      .find({})
      .then(dbPlace => res.json(dbPlace))
      .catch(err => res.status(422).json(err));
  }
}