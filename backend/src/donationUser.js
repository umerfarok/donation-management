// DonationUser.js
const mongoose = require('./db.js');

const donationUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  reminder: {
    type: Number,
    required: true,
  },
  years: [{
    year: {
      type: Number,
      required: true,
    },
    paymentSuccessful: {
      type: Boolean,
      default: false,
    },
  }],
  money: {
    type: Number,
  },
});

const DonationUser = mongoose.model("DonationUser", donationUserSchema);

module.exports = DonationUser;