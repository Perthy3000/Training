const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const auth_middleware = (req, res, next) => {
  const auth_header = req.get("authorization");
  if (auth_header) {
    const splitted_header = auth_header.split(" ");
    if (splitted_header[0] === "Bearer" && splitted_header.length === 2) {
      try {
        jwt.verify(splitted_header[1], SECRET_KEY);
        next();
        return;
      } catch (err) {}
    }
  }
  if (req.cookies.token) {
    try {
      jwt.verify(req.cookies.token, SECRET_KEY);
      next();
      return;
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Unauthorized (token invalid)", data: {} });
    }
  }
  return res
    .status(401)
    .json({ error: "Unauthorized (token invalid)", data: {} });
};

module.exports = auth_middleware;
