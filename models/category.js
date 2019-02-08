const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  alias: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  parent_aliases: [{ type: String }],
  image_id: { type: Schema.Types.ObjectId, ref: "Image" }
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;