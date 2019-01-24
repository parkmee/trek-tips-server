const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: include variables needed for Auth0
// TODO: add pre-validation for capitalization
const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String },
  preferences: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  history: [{ type: Schema.Types.ObjectId, ref: "History" }]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;