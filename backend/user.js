
const mongoose = require('./db.js');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  teamName: {
    type: String,
  },
  money: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;