const express = require('express');
const router = express.Router();
const DonationUser = require('./donationUser.js');
router.put("/editDonationUser/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, lastName, email, phone, address, reminder, year, money, paymentSuccessful } = req.body;

    const user = await DonationUser.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.name = name;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.address = address;
    user.reminder = reminder;
    user.money = money;

    const payment = user.years.find(p => p.year === parseInt(year));
    if (payment) {
      payment.paymentSuccessful = paymentSuccessful;
    } else {
      user.years.push({ year: parseInt(year), paymentSuccessful });
    }

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;