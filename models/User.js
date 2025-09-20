const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  phonenumber: { type: String, required: true, unique: true },
  photo: { type: String, default: '/images/default-profile.jpg' }
});

module.exports = mongoose.model('User', userSchema);
