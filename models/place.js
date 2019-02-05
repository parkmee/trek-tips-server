const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// main schema for places (via Yelp)
// refer to https://www.yelp.com/developers/documentation/v3/business for response body
const PlaceSchema = new Schema({
  id: { type: String, required: true },
  alias: { type: String, required: true },
  name: { type: String, required: true },
  image_url: { type: String },
  url: { type: String },
  price: { type: String },
  rating: { type: Number },
  phone: { type: String },
  display_phone: { type: String },
  categories: [
    {
      alias: { type: String, required: true },
      title: { type: String, required: true }
    }
  ],
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  location: {
    address1: { type: String, required: true },
    address2: { type: String },
    address3: { type: String },
    city: { type: String, required: true },
    zip_code: { type: String },
    state: { type: String },
    country: { type: String, required: true },
    display_address: [{ type: String }]
  },
});

const Place = mongoose.model("Place", PlaceSchema);

module.exports = Place;