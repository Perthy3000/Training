const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../db/schema/user");

dotenv.config();

const SALT_ROUNDS = process.env.SALT_ROUNDS;
const SECRET_KEY = process.env.SECRET_KEY;

const check_password = (str) => {
  if (str.length < 7) return false;
  if (str.length > 25) return false;
  return true;
};

const check_name = (str) => {
  if (str.startsWith(" ") || str.endsWith(" ")) return false;
  const contain_special = /[\s~`!@#$%\^&*+=\\[\]\\';,/{}|\\":<>\?()\.]/g.test(
    str
  );
  if (contain_special) return false;
  return true;
};

const check_email = (str) => {
  const correct_format =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      str
    );
  return correct_format;
};

router.post("/register", async (req, res) => {
  req.body.email = req.body.email.toLowerCase();

  if (
    !check_name(req.body.name) ||
    !check_email(req.body.email) ||
    !check_password(req.body.password)
  ) {
    res
      .status(400)
      .json({ error: "Invalid name or email or password", data: {} });
  } else {
    const existed = await User.findOne({
      $or: [{ name: req.body.name }, { email: req.body.email }],
    });
    if (existed) {
      res.status(400).json({
        error: "User with this name or email already exists",
        data: {},
      });
    } else {
      try {
        const encrypted_password = await bcrypt.hash(
          req.body.password,
          SALT_ROUNDS
        );
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: encrypted_password,
        });
        const token = jwt.sign(
          { user_id: user._id, role: "user" },
          SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
        user.save();
        // Cookies
        res.cookie("token", token, {
          maxAge: 60 * 60 * 24, // 1 week
          httpOnly: true,
        });
        res.json({ success: true, token: token });
      } catch (err) {
        res.status(400).json({ error: err.message, data: {} });
      }
    }
  }
});

router.post("/login", async (req, res) => {
  req.body.email = req.body.email.toLowerCase();

  if (req.body.email.length === 0 || req.body.password.length === 0) {
    res.status(400).json({ error: "Empty email or password", data: {} });
  } else if (!check_email(req.body.email)) {
    res.status(401).json({ error: "Email is invalid", data: {} });
  } else {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(401).json({ error: "Email is invalid", data: {} });
    } else {
      // Check password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        try {
          // Token
          const token = jwt.sign(
            { user_id: user._id, role: "user" },
            SECRET_KEY,
            {
              expiresIn: "1d",
            }
          );
          // Cookies
          res.cookie("token", token, {
            maxAge: 60 * 60 * 24, // 1 week
            httpOnly: true,
          });
          res.json({ success: true, token: token });
        } catch (err) {
          res.status(400).json({ error: err.message, data: {} });
        }
      } else {
        res.status(401).json({ error: "Password is invalid", data: {} });
      }
    }
  }
});

router.post("/logout", async (req, res) => {
  if (req.cookies.token) {
    try {
      // Check token
      const user = jwt.verify(req.cookies.token, SECRET_KEY);
      // Remove cookies
      res.clearCookie("token").json({ success: true, token: user });
    } catch (err) {
      res.status(401).json({ error: err.message, data: {} });
    }
  } else {
    res.status(400).json({ error: "Token not found", data: {} });
  }
});

module.exports = router;
