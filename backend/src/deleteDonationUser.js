
const express = require('express');
const router = express.Router();
const DonationUser = require('./donationUser.js');

router.delete("/deleteDonationUser/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await DonationUser.findByIdAndDelete(userId);
    res.json(deletedUser);
  } catch (error) {
    console.error("Error adding donation user:", error);
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;