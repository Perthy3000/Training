const mongoose = require("mongoose");
const { DATABASE_URL } = require("./config");

const connect_db = (appStart) => {
    mongoose
        .connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Connected to database!");
        })
        .then(() => {
            if (appStart) appStart();
        });
};

module.exports = connect_db;
