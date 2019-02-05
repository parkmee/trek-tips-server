const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Place = new Schema({
  place_id: { type: Schema.Types.ObjectId, ref: "Place", unique: true },
  isSaved: { type: Boolean, default: false },
  hasVisited: { type: Boolean, default: false },
  locationSearchString: { type: String },
  alias: { type: String, unique: true },
  name: { type: String },
  image_url: { type: String }
});

// TODO: include variables needed for Auth0
// TODO: add pre-validation for capitalization
const UserSchema = new Schema({
  name: { type: String},
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  auth0: { type: String },
  preferences: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  places: [Place]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;