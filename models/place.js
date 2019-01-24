const mongoose = require("mongoose");
const Schema = mongoose.Schema;

<<<<<<< HEAD:models/place.js
=======
// sub document for Category title
const Category = new Schema({
  title: { type: String, required: true }
});

// sub document for Coordinates
const Coordinates = new Schema({
  latitude: { type: Number },
  longitude: { type: Number }
});

// sub document for location (address)
const Location = new Schema({
  address1: { type: String, required: true },
  address2: { type: String },
  address3: { type: String },
  city: { type: String, required: true },
  state: { type: String },
  country: { type: String, required: true },
  display_address: { type: String }
});

>>>>>>> 5fca8a0ee2f05247cb5e7b7d7a18c35698834792:server/models/place.js
// main schema for places (via Yelp)
// refer to https://www.yelp.com/developers/documentation/v3/business for response body
const PlaceSchema = new Schema({
  yelpId: { type: String, required: true },
  name: { type: String, required: true },
  image_url: { type: String },
  url: { type: String },
  price: { type: String },
  yelpRating: { type: Number },
  phone: { type: String },
  categories: [{title: { type: String, required: true }}],
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  location: {
    address1: { type: String, required: true },
    address2: { type: String },
    address3: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    display_address: { type: String }
  },
  rating: [{ type: Schema.Types.ObjectId, ref: "Rating" }]
});

const Place = mongoose.model("Place", PlaceSchema);

module.exports = Place;