const express = require("express");
const cors = require("cors");
const app = express();
const events = require('events');
const bcrypt = require("bcrypt");
const verifyToken = require('./jwtAuthMiddleware');
const loginRoute = require('./login.js');
const User = require('./user.js');
const DonationUser = require('./donationUser.js')
const addDonationUserRoute = require('./addDonationUser.js');
const editDonationUserRoute = require('./editDonationUser.js');
const deleteDonationUserRoute = require('./deleteDonationUser.js');
const getDonationUsersRoute = require('./getDonationUsers.js');
const secretKey = require('./constants.js');
const nodemailer = require('nodemailer');
var eventEmitter = new events.EventEmitter();
const dotenv = require('dotenv');
const createDefaultUser = require('./defaultUser'); 

dotenv.config();
createDefaultUser().catch(console.error);

var sendEmailOnEventArrive =async function (email, userName) {
  console.log('Reminder sent', email);
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASSWORD 
    }
  });
  
  let mailOptions = {
    from: 'umarkml713@gmail.com',
    to: email,
    subject: 'Your Contribution Matters - Please Donate for the Masjid',
    text: `Dear ${userName},
  
  We hope this message finds you well.
  
  We noticed that we haven't received your donation for the Masjid this month. Your contributions play a significant role in maintaining the Masjid and supporting our community.
  
  If you haven't had a chance to donate yet, we kindly request you to do so at your earliest convenience. Every donation, no matter the size, makes a difference.
  
  You can make your donation through ClickHere to Payment link.
  
  Thank you for your continued support. We greatly appreciate your generosity.
  
  Best regards,
  Masjid Committee
  `
  };
  const user = await DonationUser.findOneAndUpdate({ email: email },{ $inc: { reminder: 1 } }, { new: true });
  console.log('User reminder updated:', user);
  console.log(user.reminder);
     transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log('Error occurred', error);
    } else {
      console.log('Email sent', info.response);
      try {
        const user = await User.findOneAndUpdate({ email: email },{ $inc: { reminder: 1 } }, { new: true });
        console.log('User reminder updated:', user);
        return user.reminder;
      } catch (error) {
        console.error('Error updating user reminder:', error);
      }
    }
  });
}

eventEmitter.on('SendEmail', sendEmailOnEventArrive);

const PORT = 4000;


app.use(express.json());
app.use(cors());
app.use(loginRoute);
app.use(addDonationUserRoute);
app.use(editDonationUserRoute);
app.use(deleteDonationUserRoute);
app.use(getDonationUsersRoute);

app.post('/sendReminder', verifyToken,  (req, res) => {
  const {email, userName} = req.body
  eventEmitter.emit('SendEmail', email, userName);
  res.send('Reminder sent');
} );

app.get('/isLoggedIn', verifyToken, (req, res) => {
  return res.json(true);
});
app.get("/",(req, res) => {
  res.send("Welcome to the Donation Management API");
});
app.get("/home", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    eventEmitter.emit('dinder');
    res.json(users);
  } catch (error) {
    console.error("Error adding donation user:", error);
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

app.patch("/users/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  const { money } = req.body;
  const amount = money
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
    console.error("Error adding donation user:", error);
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

app.post("/register", async (req, res) => {

  try {
    const { name, email, password, date, teamName, money } = req.body;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

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
    console.error("Error adding donation user:", error);
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

app.post("/logout", (req, res)=>{
  res.status(200).json({ message: 'Logged out successfully' });
}
)

app.delete("/users/:userId", verifyToken, async (req, res) => {
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
    console.error("Error adding donation user:", error);
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});




app.listen(PORT, () => {
  createDefaultUser().catch(console.error);
  console.log(`Server is running on port ${PORT}`);
});
