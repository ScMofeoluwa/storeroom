const { User } = require("../models");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user)
    return res.status(400).send({ message: "Invalid email or password" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ message: "Invalid email or password" });

  if (user.isVerified == false)
    return res
      .status(400)
      .send({ message: "Pending Account. Please Verify Your Email!" });

  const response = {
    accessToken: user.generateAccessToken(),
    refreshToken: user.generateRefreshToken(),
  };
  res.status(200).send(response);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
