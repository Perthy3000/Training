const mongoose = require("mongoose");

const connect_db = async (MONGO_URL) => {
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
