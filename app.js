const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, ".env.default") });

const connect_db = require("./db/connect");
const EchoRoute = require("./controller/echo");
const TodoRoute = require("./controller/todo");
const AuthRoute = require("./controller/auth");
const TodoAuthRoute = require("./controller/todo_auth");
const authMiddleware = require("./controller/auth_middleware");

async function main() {
  const PORT = process.env.PORT || 3000;

  await connect_db();
  const app = express();

  // create a write stream (in append mode)
  var accessLogStream = fs.createWriteStream(
    path.join(__dirname, "log", "access.log"),
    { flags: "a" }
  );

  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));

  app.use(cookieParser());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ first: "page" });
  });

  app.use("/app/echo", EchoRoute);

  app.use("/app/no_auth", TodoRoute);

  app.use("/app/auth", AuthRoute);

  app.use("/app/with_auth", authMiddleware, TodoAuthRoute);

  app.listen(PORT, () => {
    console.log("Server has started!");
  });
}

main();
