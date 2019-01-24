const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
  _user: { type: Schema.ObjectId, ref: "User" },
  _place: { type: Schema.Types.ObjectId, ref: "Place" },
  userRating: { type: Number },
  userComment: { type: String }
});

const Rating = mongoose.model("Rating", RatingSchema);

module.exports = Rating;