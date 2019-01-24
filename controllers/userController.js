const db = require("../models");

// methods for userController
module.exports = {
  createUser: function(req, res) {
    db.User
      .create(req.body)
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  findUserById: function(req, res) {
    db.User
      .findById({ _id: req.params.id })
      .populate("preferences")
      .populate("history")
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  addUserPreference: function(req, res) {
    const categoryId = req.params.categoryid;
    const userId = req.params.id;

    db.User
      .findByIdAndUpdate(userId, { $push: { preferences: categoryId } }, { new: true })
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  removeUserPreference: function(req, res) {
    const categoryId = req.params.categoryid;
    const userId = req.params.id;

    db.User
      .findByIdAndUpdate(userId, { $pull: { preferences: categoryId } } )
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  }
}