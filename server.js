const express = require("express");
const app = express();
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');
const controllerlog = require("./controllers/controllerlog");

// Initialize dotenv only once
dotenv.config();

console.log(process.env.MONGO_URI);

// CORS Configuration
var corsOptions = {
  origin: 'http://localhost:3000', // ensure this matches your frontend's actual origin
  optionsSuccessStatus: 200 // for legacy browsers
}

// Enable CORS with the options
app.use(cors(corsOptions));

// Configure mongoose and establish a connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB");
}).on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// Middlewares
app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride("_method"));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../Captains-Log-Front/build')));

// Routes
app.use("/logs", controllerlog);

// This catch-all route needs to be the last route defined
// Also, make sure that the path to 'index.html' is correct
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Captains-Log-Front/build', 'index.html'));
});

// Generic error handler
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});