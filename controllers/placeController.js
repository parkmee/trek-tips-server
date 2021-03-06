const db = require("../models");

module.exports = {
  deletePlace: function(req, res) {
    db.Place
      .findByIdAndDelete(req.params.id)
      .then(dbPlace => res.json(dbPlace))
      .catch(err => res.status(422).json(err));
  },
  addPlace: function(req, res) {
    const query = { id: req.body.id };
    const update = { $set: req.body };
    const options = { new: true, upsert: true };

    db.Place
      .findOneAndUpdate(query, update, options)
      .then(dbPlace => {
        console.log(dbPlace);
        res.json(dbPlace);
      })
      .catch(err => {
        console.log(err);
        res.status(422).json(err)
      });
  }
}