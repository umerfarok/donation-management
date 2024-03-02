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
  paymentSuccessful: {
    type: Boolean,
    default: false,
  },
});

const DonationUser = mongoose.model("DonationUser", donationUserSchema);

module.exports = DonationUser;