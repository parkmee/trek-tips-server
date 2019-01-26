// merged into user - delete when model is finalized

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: "User" },
  _place: { type: Schema.Types.ObjectId, ref: "Place" },
  isSaved: { type: Boolean, default: false },
  hasVisited: { type: Boolean, default: false }
});

const History = mongoose.model("History", HistorySchema);

module.exports = History;