
const express = require('express');
const router = express.Router();
const DonationUser = require('./donationUser.js');

router.get("/getDonationUsers", async (req, res) => {
  try {
    const users = await DonationUser.find({});
    res.json(users);
  } catch (error) {
    console.error("Error adding donation user:", error);
res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;