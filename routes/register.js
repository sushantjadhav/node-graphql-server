const express = require("express");
const router = express.Router();
const Joi = require("joi");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const JWT = require("jsonwebtoken");

const keys = require("../configs/keys");

const schema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// @route   POST api/register
// @desc    Register User
// @access  Public
router.post("/", async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  value.id = uuidv4();
  try {
    // if USER EXIST return error
    let response = await axios.get(`${keys.URI}/users`);

    const isUserExist = response.data.filter(
      (user) => user.username.toLowerCase() === value.username.toLowerCase()
    ).length;

    if (isUserExist) {
      return res.status(500).json({ error: "User already exist" });
    }

    // if USER NOT EXIST add user
    response = await axios.post(`${keys.URI}/users`, value);

    // Return JWT
    const payload = { user: { id: response.data.id } };

    JWT.sign(payload, keys.JWTSecret, { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;

      console.log("id: ", response.id);
      console.log("token: ", token);

      res.json(token);
    });
  } catch (err) {
    console.log("error: ", err.message);
    res.status(500).json(err);
  }
});

module.exports = router;
