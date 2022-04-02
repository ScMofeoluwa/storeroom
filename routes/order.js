const { Store, Product, Order, ProductOrder } = require("../models");
const paystack = require("../services/paystack");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const store = await Store.findByPk(req.body.storeId);
  if (!store)
    return res
      .status(404)
      .send({ message: "Store with the given ID doesn't exist" });

  let amount = 0;
  for (item of req.body.products) {
    const product = await Product.findByPk(item.id);
    amount += item.quantity * product.price;
    if (!product || product.storeId !== req.body.storeId)
      return res
        .status(400)
        .send({ message: "Product with the given ID doesn't exist" });
  }

  const order = await Order.create({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    txnRef: uuidv4(),
  });

  for (item of req.body.products) {
    let productOrder = {
      productId: item.id,
      orderId: order.id,
      quantity: item.quantity,
    };
    productOrder = await ProductOrder.create(productOrder);
  }

  const payload = {
    amount: amount * 100,
    email: req.body.email,
    currency: req.body.currency,
    reference: order.txnRef,
    callback_url: process.env.PAYSTACK_CALLBACK_URL,
  };

  const data = await paystack.initializePayment(payload);
  return res.send(data);
});

router.get("/paystack/callback", async (req, res) => {
  const txnRef = req.query.trxref;
  const data = await paystack.verifyPayment(txnRef);

  if (!data) return res.send({ message: "Transaction not found" });

  if (data.data.status === "failed") {
    let order = await Order.findOne({ where: { txnRef: txnRef } });
    order.status = "failed";
    await order.save();
    return res.send({ message: "Payment failed" });
  } else {
    let order = await Order.findOne({ where: { txnRef: txnRef } });
    order.status = "success";
    await order.save();
    return res.send({ message: "Payment successful" });
  }
});

router.get("/", async (req, res) => {
  const order = await Order.findAll({
    include: {
      model: Product,
      as: "products",
      required: false,
      attributes: ["id", "name"],
      through: {
        model: ProductOrder,
        as: "productOrders",
        attributes: ["quantity"],
      },
    },
  });
  res.send(order);
});

module.exports = router;
