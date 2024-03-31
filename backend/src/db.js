
const mongoose = require("mongoose");
// const CONNECTION_STRING ="mongodb+srv://umer:Kamalia713@cluster0.rlon9nk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const CONNECTION_STRING = "mongodb://maxstore:maxstore-password@localhost:27017"
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



module.exports = mongoose;