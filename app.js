const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const connect_db = require("./db/connect");
const EchoRoute = require("./controller/echo");
const TodoRoute = require("./controller/todo");
const AuthRoute = require("./controller/auth");
const TodoAuthRoute = require("./controller/todo_auth");
const authMiddleware = require("./controller/auth_middleware");

async function main() {
  // dotenv.config({ path: path.join(__dirname, ".env") });
  dotenv.config();

  const PORT = process.env.PORT || 3000;
  const MONGO_URL = process.env.MONGO_URL;

  await connect_db(MONGO_URL);
  const app = express();

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
