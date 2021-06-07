const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema(
  {
    name: String,
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now() },
  },
  { collection: "User" }
);

module.exports = mongoose.model("user", userSchema);
