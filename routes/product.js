const { Store, Product, Image } = require("../models");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/:productId", async (req, res) => {
  const product = await Product.findByPk(req.params.productId, {
    include: { model: Image, as: "images" },
    attributes: { exclude: "imageId" },
  });
  if (!product)
    return res
      .status(404)
      .send({ message: "Product with given ID doesn't exist" });

  res.send(product);
});

router.post("/", auth, async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.storeId);
    if (!store || store.userId !== req.user.id)
      return res
        .status(404)
        .send({ message: "Store with the given ID doesn't exist" });
    const newProduct = _.merge(req.body, { storeId: req.params.storeId });
    const product = await Product.create(newProduct);
    res.status(201).send(product);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        msg: err.errors.map((e) => e.message),
      });
    }
  }
});

router.put("/:productId", auth, async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.storeId);
    if (!store || store.userId !== req.user.id)
      return res
        .status(404)
        .send({ message: "Store with the given ID doesn't exist" });
    let product = await Product.findByPk(req.params.productId, {
      include: { model: Image, as: "images" },
      attributes: { exclude: "imageId" },
    });
    if (!product || product.storeId !== parseInt(req.params.storeId))
      return res
        .status(404)
        .send({ message: "Product with given ID doesn't exist" });
    product = await product.set(req.body);
    await product.save();
    res.send(product);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        msg: err.errors.map((e) => e.message),
      });
    }
  }
});

router.delete("/:productId", auth, async (req, res) => {
  const store = await Store.findByPk(req.params.storeId);
  if (!store || store.userId !== req.user.id)
    return res
      .status(404)
      .send({ message: "Store with the given ID doesn't exist" });
  const product = await Product.findByPk(req.params.productId);
  if (!product || product.storeId !== parseInt(req.params.storeId))
    return res
      .status(404)
      .send({ message: "Product with given ID doesn't exist" });
  await product.destroy();
  res.send(product);
});

module.exports = router;
