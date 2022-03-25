const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const header = req.header("Authorization");
  const bearer = header.split(" ");
  const token = bearer[1];
  if (!token) return res.status(401).send("Access Denied: No token provided");
  try {
    const payload = jwt.verify(token, config.atSecret);
    req.user = payload;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};
