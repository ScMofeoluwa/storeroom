const { Store, Product, Order, ProductOrder } = require("../models");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const stores = await Store.findAll({
    where: { userId: req.user.id },
    include: { model: Product, as: "products" },
  });
  res.status(200).send(stores);
});

router.get("/:storeId", async (req, res) => {
  const store = await Store.findByPk(req.params.storeId, {
    include: { model: Product, as: "products" },
  });
  if (!store)
    return res
      .status(404)
      .send({ message: "Store with the given ID doesn't exist" });
  res.status(200).send(store);
});

router.post("/", auth, async (req, res) => {
  try {
    let store = await Store.findOne({ where: { name: req.body.name } });
    if (store)
      return res
        .status("400")
        .send({ message: "Store with name already exists" });

    const newStore = _.merge(req.body, { userId: req.user.id });
    store = await Store.create(newStore);
    res.status(201).send(store);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        msg: err.errors.map((e) => e.message),
      });
    }
  }
});

router.put("/:storeId", auth, async (req, res) => {
  try {
    let store = await Store.findByPk(req.params.storeId, {
      include: { model: Product, as: "products" },
    });
    if (!store || store.userId !== req.user.id)
      return res
        .status(404)
        .send({ message: "Store with the given ID does't exist" });
    store = await store.set(req.body);
    await store.save();
    res.status(200).send(store);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        msg: err.errors.map((e) => e.message),
      });
    }
  }
});

router.delete("/:storeId", auth, async (req, res) => {
  const store = await Store.findByPk(req.params.storeId);
  if (!store || store.userId !== req.user.id)
    return res
      .status(404)
      .send({ message: "Store with the given ID doesn't exist" });
  await store.destroy();
  res.status(200).send({ message: "Store deleted" });
});

router.get("/:storeId/orders", auth, async (req, res) => {
  const store = await Store.findByPk(req.params.storeId);
  if (!store || store.userId !== req.user.id)
    return res
      .status(404)
      .send({ message: "Store with the given ID does't exist" });
  const order = await Order.findAll({
    include: {
      model: Product,
      as: "products",
      attributes: ["id", "name"],
      where: { storeId: store.id },
      through: {
        model: ProductOrder,
        as: "productOrders",
        attributes: ["quantity"],
      },
    },
  });
  res.status(200).send(order);
});

module.exports = router;
