const jwt = require("jsonwebtoken");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

module.exports = function (req, res, next) {
  const header = req.header("Authorization");
  const bearer = header.split(" ");
  const token = bearer[1];
  const url = req.originalUrl.split("/").at(-1);
  const isRefresh = url === "refresh";
  if (!token) return res.status(401).send({message: "Access Denied: No token provided"});
  try {
    const payload = isRefresh
      ? jwt.verify(token, config.rtSecret)
      : jwt.verify(token, config.secret);
    req.user = payload;
    next();
  } catch (ex) {
    res.status(400).send({message: "Invalid token"});
  }
};
