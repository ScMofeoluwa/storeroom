const express = require("express");
const { Order } = require("../models");
const paystack = require("../services/paystack");
const crypto = require("crypto");
const router = express.Router();

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

router.get("/paystack/callback", async (req, res) => {
  let message = "true";
  const txnRef = req.query.trxref;
  const data = await paystack.verifyPayment(txnRef);

  if (!data) return res.send({ message: "Transaction not found" });

  if (data.data.status === "failed") {
    let order = await Order.findOne({ where: { txnRef: txnRef } });
    order.status = "failed";
    message = "false";
    await order.save();
  }
  res.send(`<h2> Payment successful:  ${message} </h2>`);
});

router.post("/paystack/webhook", async (req, res) => {
  const hash = crypto
    .createHmac("sha512", config.paystackSecret)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (hash == req.headers["x-paystack-signature"]) {
    const event = req.body;
    if (event.event === "charge.success") {
      let txnRef = event.data.reference;
      let order = await Order.findOne({ where: { txnRef: txnRef } });
      order.status = "success";
      await order.save();
    }
  }
  res.send(200);
});

module.exports = router;
