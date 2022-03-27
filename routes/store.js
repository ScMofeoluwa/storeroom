const { Store, Product } = require("../models");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const stores = await Store.findAll({
    where: { userId: req.user.id },
    include: { model: Product, as: "products" },
  });
  res.send(stores);
});

router.get("/:id", auth, async (req, res) => {
  const store = await Store.findByPk(req.params.id);
  if (!store || store.userId !== req.user.id)
    return res
      .status(404)
      .send({ message: "Store with the given ID doesn't exist" });
  res.send(store);
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

router.put("/:id", auth, async (req, res) => {
  try {
    let store = await Store.findByPk(req.params.id);
    if (!store || store.userId !== req.user.id)
      return res
        .status(404)
        .send({ message: "Store with the given ID does't exist" });
    store = await store.set(req.body);
    await store.save();
    res.send(store);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        msg: err.errors.map((e) => e.message),
      });
    }
  }
});

router.delete("/:id", auth, async (req, res) => {
  const store = await Store.findByPk(req.params.id);
  if (!store || store.userId !== req.user.id)
    return res
      .status(404)
      .send({ message: "Store with the given ID doesn't exist" });
  await store.destroy();
  res.send(store);
});

module.exports = router;
