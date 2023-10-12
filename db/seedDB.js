const mongoose = require('mongoose');
const Log = require('../models/modellog'); // Adjust path as necessary
require('dotenv').config();
const connectDB = require('./connection'); // Import your DB connection, adjust path as necessary
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


// Seed data
const seedLogs = [
  {
    title: 'Test Log 1',
    entry: 'This is the first test log.',
    shipIsBroken: true,
  },
  {
    title: 'Test Log 2',
    entry: 'This is the second test log.',
    shipIsBroken: false,
  },
  {
    title: 'Test Log 3',
    entry: 'This is the third test log.',
    shipIsBroken: true,
  },
];

// Delete all existing logs and insert seed logs
const seedDB = async () => {
  try {
    await Log.deleteMany({});
    console.log('Cleared Log collection.');
    await Log.insertMany(seedLogs);
    console.log('Log seeds planted.');
  } catch (error) {
    console.log(error);
  } finally {
    // mongoose.connection.close();
  }
};

// Establish connection to DB and then seed data
const runSeeder = async () => {
  await connectDB();
  await seedDB();
};

console.log("URI: ", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('MONGO_URI:', process.env.MONGO_URI);
runSeeder();