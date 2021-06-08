const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

const connect_db = async () => {
  await mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database!");
    });
};

module.exports = connect_db;
