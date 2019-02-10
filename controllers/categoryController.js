const db = require("../models");

// TODO: filter categories by those with populated images
module.exports = {
  // get all parent category: arts, active, restaurants, nightlife, food, shopping, etc
  getParentCategories: function (req, res) {
    db.Category
      .find({ "parent_aliases.0": { "$exists": false } })
      .populate("image_id")
      .then(dbCategory => res.json(dbCategory))
      .catch(err => res.status(422).json(err));
  },

  // get all children of parent category (using parent alias name)
  getChildCategories: function (req, res) {
    const parentAlias = req.params.parentCategory;

    db.Category
      .find({ "parent_aliases": parentAlias })
      .populate("image_id")
      .then(dbCategory => res.json(dbCategory))
      .catch(err => res.status(422).json(err));
  },
  // get document for one category based on Yelp category alias
  getOneCategory: function (req, res) {
    const categoryAlias = req.params.categoryAlias;

    db.Category
      .find({ "alias": categoryAlias })
      .then(dbCategory => res.json(dbCategory))
      .catch(err => res.status(422).json(err));
  }
}