const db = require("../models");

module.exports = {
  deletePlace: function(req, res) {
    db.Place
      .findByIdAndDelete(req.params.id)
      .then(dbPlace => res.json(dbPlace))
      .catch(err => res.status(422).json(err));
  }
}