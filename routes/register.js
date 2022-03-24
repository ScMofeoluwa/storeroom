const { User } = require("../models");
const { sendMail } = require("../utils/sendMail");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  let user = await User.findOne({ where: { email: req.body.email } });
  if (user) return res.status(400).send("User already registered");

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  user = await User.create(_.pick(req.body, ["username", "email", "password"]));

  const verificationToken = user.generateVerificationToken();
  sendMail(user, verificationToken);
  return res.status(200).send({
    message: `Verification mail was sent to ${user.email}`,
  });
});

module.exports = router;
