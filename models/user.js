const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Place = new Schema({
  place_id: { type: Schema.Types.ObjectId, ref: "History" },
  isSaved: { type: Boolean, default: false },
  hasVisited: { type: Boolean, default: false }
})

const Location = new Schema({
  location_id: { type: Schema.Types.ObjectId, ref: "Location" },
  places: [Place] 
})

// TODO: include variables needed for Auth0
// TODO: add pre-validation for capitalization
const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  auth0: { type: String, unique: true },
  preferences: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  locations: [Location],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;