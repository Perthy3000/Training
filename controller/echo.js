const express = require("express");
const router = express.Router();

router.get("/echo_get", (req, res) => {
  res.json({ message: "Echo from the other side" });
});

router.get("/echo_params/:param", (req, res) => {
  res.json({ params: req.params.param });
});

router.get("/echo_qs", (req, res) => {
  res.json(req.query);
});

router.post("/", (req, res) => {
  res.json(req.body);
});

module.exports = router;
