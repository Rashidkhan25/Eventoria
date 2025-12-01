
const mongoose = require("mongoose");

const communityChatSchema = new mongoose.Schema({
  eventId: String,
  user: String,
  text: String,
  time: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CommunityChat", communityChatSchema);
