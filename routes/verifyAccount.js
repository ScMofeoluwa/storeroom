const { User } = require("../models");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const token = req.params.id;
  if (!token) return res.status(422).send({ message: "missing token" });

  try {
    req.user = jwt.verify(token, process.env.VERIFICATION_SECRET);
  } catch (err) {
    return res.status(500).send(err);
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
      message: "Account Verified",
    });
  } catch (ex) {
    return res.status(500).send(ex);
  }
});

module.exports = router;
