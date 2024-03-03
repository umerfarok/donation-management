// editDonationUser.js
const express = require('express');
const router = express.Router();
const DonationUser = require('./donationUser.js');

router.put("/editDonationUser/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await DonationUser.findByIdAndUpdate(userId, req.body, { paymentSuccessful: true });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error adding donation user:", error);
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;