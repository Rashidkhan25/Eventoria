const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: String,
  tagline: String,
  category: String, 
  banner: String,
  thumbnail: String,
  description: String,
  artists: [String],
  pdf: String
});

module.exports = mongoose.model("Event", EventSchema);
