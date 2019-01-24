const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  city: { type: String, required: true },
  state: { type: String },
  country: { type: String, required: true }
});

const Location = mongoose.model("Location", LocationSchema);

module.exports = Location;