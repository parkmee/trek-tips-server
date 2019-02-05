const db = require("../models");

module.exports = {
  // get all parent category: arts, active, restaurants, nightlife, food, shopping, etc

  getParentCategories: function(req, res) {
    db.Category
      .find({ "parent_aliases.0": { "$exists": false }})
      .then(dbCategory => res.json(dbCategory))
      .catch(err => res.status(422).json(err));
  }
}
// get by parent alias
// return