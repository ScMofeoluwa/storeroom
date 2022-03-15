const { User } = require("../models");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user) return res.status(400).send("User already registered");

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = await User.create(
      _.pick(req.body, ["username", "email", "password"])
    );

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
    return res
      .header("x-auth-token", token)
      .send(_.pick(user, ["id", "username", "email"]));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
