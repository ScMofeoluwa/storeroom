const { User } = require("../models");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user) return res.status(400).send("User already registered");

    user = await User.create(
      _.pick(req.body, ["username", "email", "password"])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return res.status(201).send(_.pick(user, ["id", "username", "email"]));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
