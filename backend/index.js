const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const events = require('events');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const verifyToken = require('./jwtAuthMiddleware');


// secret key for encryption of password salt
const secretKey = 'your-secret-key';


var eventEmitter = new events.EventEmitter();


var myEventHandler = function () {
  console.log('I hear a scream!');
}


eventEmitter.on('scream', myEventHandler);



const PORT = 4000;

const CONNECTION_STRING =
  "mongodb+srv://umerfarooqdev:bigbang713@cbcteam.kgcnp1f.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

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

app.use(express.json());
app.use(cors());

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // matching the crypto password with the incoming password...
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // password is valid and senig a token for front end that expires in 1 hr
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    res.json({ token: token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Something went wrong");
  }
});


app.get("/home",verifyToken , async (req, res) => {
  try {
    const users = await User.find();
    eventEmitter.emit('dinder');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Something went wrong");
  }
});

app.patch("/users/:userId",verifyToken, async (req, res) => {
  const { userId } = req.params;
  const { money } = req.body;
  const amount   = money
  console.log(money + " " + userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.money += amount;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Something went wrong");
  }
});

app.post("/register", async (req, res) => {

  try {
    const { name, email, password, date, teamName, money } = req.body;

    // Generate a salt to be used for password hashing
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password and additional fields
    const user = new User({
      name,
      email,
      password: hashedPassword,
      date,
      teamName,
      money,
    });

    const result = await user.save();
    res.json(result);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Something went wrong");
  }
});

app.delete("/users/:userId",verifyToken , async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;
  console.log(`delete user ${userId} and password ${password}`)
  // Check if the password matches the expected deleting password
  if (+password !== 12345) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findByIdAndDelete(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
