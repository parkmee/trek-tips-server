const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    category: { type: String },
    image_url: { type: String }
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;