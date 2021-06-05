const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = Schema(
  {
    title: String,
    createdAt: { type: Date, default: Date.now() },
    order: Number,
  },
  { collection: "Todo" }
);

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
