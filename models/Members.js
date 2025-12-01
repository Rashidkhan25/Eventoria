const mongoose = require("mongoose");

const communityMemberSchema = new mongoose.Schema({
  eventId: String,
  members: [String]   
});

module.exports = mongoose.model("CommunityMember", communityMemberSchema);
