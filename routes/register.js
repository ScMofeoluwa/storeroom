const { User } = require("../models");
const { sendMail } = require("../utils/sendMail");
const _ = require("lodash");
const bcrypt = require("bcrypt");
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

    const verificationToken = user.generateVerificationToken();
    try {
      const kek = sendMail(user, verificationToken);
      if (kek.messageId) {
        //console.log(kek);
        return res
          .status(200)
          .send({ message: `Verification mail was sent to ${user.email}` });
      }
    } catch (err) {
      return res.status(400).send("Failed to send email");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
