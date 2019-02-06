const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  isSaved: [{ type: Schema.Types.ObjectId, ref: "Place" }],
  hasVisited: [{ type: Schema.Types.ObjectId, ref: "Place" }]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;