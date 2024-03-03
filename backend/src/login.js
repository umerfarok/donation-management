// login.js
const express = require('express');
const router = express.Router();
const User = require('./user.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const secretKey = require('./constants').secretKey;
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    res.json({ token: token });
  } catch (error) {
    console.error("Error adding donation user:", error);
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;