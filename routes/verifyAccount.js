const { User } = require("../models");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const token = req.params.id;
  if (!token) return res.status(400).send({ message: "missing token" });

  try {
    req.user = jwt.verify(token, config.veriSecret);
  } catch (err) {
    return res.status(400).send(err);
  }

  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).send({
        message: "User does not  exists",
      });
    }
    user.isVerified = true;
    await user.save();

    return res.status(200).send({
      message: "Account successfully verified",
    });
  } catch (ex) {
    return res.status(500).send(ex);
  }
});

module.exports = router;
