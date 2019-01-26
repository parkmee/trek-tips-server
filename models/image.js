const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    title: { type: String, unique: true },
    image_url: { type: String }
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;