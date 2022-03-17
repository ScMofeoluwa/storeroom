const { Store } = require("../models");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const stores = await Store.findAll();
  res.send(stores);
});

module.exports = router;
