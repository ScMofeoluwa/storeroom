const { Store, Product, Image } = require("../models");
const auth = require("../middleware/auth");
const upload = require("../utils/multer");
const { fileUpload } = require("../services/streamifier");
const express = require("express");
const router = express.Router({ mergeParams: true });

router.post("/upload", upload.single("images"), auth, async (req, res) => {
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

  const imgs = await Image.findAll({
    where: { productId: req.params.productId },
  });
  //const imgs = await product.getImages();
  if (imgs.length >= 5) {
    return res.status(400).send({
      message: "max number of images for this product has been exceeded",
    });
  }
  const image = await fileUpload(req);
  await Image.create({
    url: image.secure_url,
    productId: req.params.productId,
  });
  res.send({ message: "Image(s) uploaded successfully" });
});

router.delete("/:imageId", auth, async (req, res) => {
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
  const image = await Image.findByPk(req.params.imageId);
  if (!image || image.productId !== parseInt(req.params.productId))
    return res
      .status(404)
      .send({ message: "Image with the given ID doesn't exist" });
  await image.destroy();
  res.send({ message: "Image successfully deleted" });
});
module.exports = router;
