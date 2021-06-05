const express = require("express");
const connect_db = require("./db/connect");
const EchoRoute = require("./controller/echo");
const TodoRoute = require("./controller/todo");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ first: "page" });
});

app.use("/app/echo", EchoRoute);

app.use("/app/no_auth", TodoRoute);

connect_db();
app.listen(PORT, () => {
  console.log("Server has started!");
});
