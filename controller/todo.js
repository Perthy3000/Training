const express = require("express");
const router = express.Router();
const Todo = require("../db/schema/todo");

router.get("/todos", async (req, res) => {
    try {
        const todoList = await Todo.find({});
        res.json({ success: true, count: todoList.length, data: todoList });
    } catch (err) {
        res.status(400).json({ error: "There is an error", data: {} });
    }
});

router.get("/todos/:_id", async (req, res) => {
    const todo = await Todo.find({ _id: req.params._id });
    if (todo.length == 0) {
        res.status(400).json({ error: "todo not found", data: {} });
    } else {
        res.json({ success: true, data: todo });
    }
});

router.post("/todos", async (req, res) => {
    try {
        const maxValue = await Todo.find({}).sort({ order: -1 }).limit(1);
        const todo = await Todo.create({
            title: req.body.title,
            order: maxValue.length > 0 ? maxValue[0].order + 1 : 1,
        });
        res.json({ success: true, data: todo });
    } catch (err) {
        res.status(400).json({ error: "There is an error", data: {} });
    }
});

router.put("/todos/:_id", async (req, res) => {
    const todo = await Todo.findOneAndUpdate(
        { _id: req.params._id },
        { title: req.body.title },
        { new: true }
    );
    if (!todo) {
        res.status(400).json({ error: "todo not found", data: {} });
    } else {
        res.json({ success: true, data: todo });
    }
});

router.delete("/todos/:_id", async (req, res) => {
    const todo = await Todo.deleteOne({ _id: req.params._id });
    if (todo.n == 0) {
        res.status(400).json({ error: "todo not found", data: {} });
    } else {
        res.json({ success: true, data: {} });
    }
});

module.exports = router;
