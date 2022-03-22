const { User } = require("../models");
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { token } = req.params;
  if (!token) return res.status(422).send({ message: "missing token" });

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = payload;
  } catch (ex) {
    res.status(400).send("Invalid token");
  }

  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).send({
        message: "User does not  exists",
      });
    }

    user.verified = true;

    return res.status(200).send({
      message: "Account Verified",
    });
  } catch (ex) {
    return res.status(500).send(ex);
  }
});
