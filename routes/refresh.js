const { User } = require("../models");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  const accessToken = user.generateAccessToken();
  return res.status(200).send({ accessToken: accessToken });
});

module.exports = router;
