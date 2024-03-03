const express = require('express');
const router = express.Router();
const DonationUser = require('./donationUser.js');
const verifyToken = require('./jwtAuthMiddleware');

router.post("/addDonationUser", verifyToken, async (req, res) => {
  try {
    const { name, lastName, email, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await DonationUser.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const donationUser = new DonationUser({
      name,
      lastName,
      email,
      phone,
      address,
    });

    const result = await donationUser.save();
    res.json(result);
  } catch (error) {
    console.error("Error adding donation user:", error);
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;