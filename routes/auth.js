const express = require("express");
const router = express.Router();

const Joi = require("joi");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const JWT = require("jsonwebtoken");
const auth = require("../middlewares/auth");

const keys = require("../configs/keys");

// @route   GET api/auth
// @desc    Get JWT
// @access  Private
router.get("/", auth, async (req, res) => {
  const response = await axios.get(`${keys.URI}/users`);
  const user = response.data.find((user) => user.id === req.user.id);

  delete user.username;
  delete user.password;

  res.json(user);
});

// @route   POST api/auth/login
// @desc    Login user
// @access  Private
const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

router.post("/login", async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // GET User
    const response = await axios.get(`${keys.URI}/users`);
    const user = response.data.find((user) => user.username === value.username);

    console.log("user ----------", user);
    // User NOT FOUND
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // USER FOUND but invalid credentials
    if (user.password !== value.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Return JWT
    const payload = { user: { id: user.id } };

    JWT.sign(payload, keys.JWTSecret, { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;

      console.log("id: ", response.id);
      console.log("token created successfully: ", token);

      res.json(token);
    });
  } catch (err) {
    console.log("error: ", err.message);
    res.status(500).json(err);
  }
});

// @route   GET api/auth/logout
// @desc    Logout user
// @access  Public
router.post("/logout", (req, res) => {
  req.user = null;
  res.send("Loggedout User Successfully");
});

module.exports = router;
