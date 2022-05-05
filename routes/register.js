const { User } = require("../models");
const { sendMail } = require("../utils/sendMail");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user)
      return res
        .status(400)
        .send({ message: "User with that email already exists" });

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = await User.create(
      _.pick(req.body, ["username", "email", "password"])
    );

    const verificationToken = user.generateVerificationToken();
    sendMail(user, verificationToken);
    return res.status(200).send({
      message: `Verification mail was sent to ${user.email}`,
    });
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        msg: err.errors.map((e) => e.message),
      });
    }
  }
});

module.exports = router;
