const mongoose = require("mongoose");
const { DATABASE_URL } = require("./config");

const connect_db = () => {
  mongoose
    .connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database!");
    });
};

module.exports = connect_db;
