const express = require('express');
const router = express.Router();
const DonationUser = require('./donationUser.js');

router.get("/getDonationUsers", async (req, res) => {
  try {
    let query = {};

    if (req.query.year && req.query.year !== "") {
      const year = parseInt(req.query.year);
      if (!isNaN(year)) {
        query["years.year"] = year;
      } else {
        throw new Error("Invalid 'year' parameter");
      }
    }
    const users = await DonationUser.find(query);
    res.json(users);
  } catch (error) {
    console.error("Error fetching donation users:", error);
    res.status(500).send({ message: "Something went wrong in getting users ", error: error.message });
  }
});

module.exports = router;
