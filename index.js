const express = require("express");
const logger = require("./utils/logger");
const morganMiddleware = require("./middleware/morgan.middleware");

const register = require("./routes/register");
const login = require("./routes/login");
const stores = require("./routes/store");
const verify = require("./routes/verifyAccount");
const products = require("./routes/product");
const images = require("./routes/image");
const orders = require("./routes/order");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/verify", verify);
app.use("/api/stores", stores);
app.use("/api/:storeId/products", products);
app.use("/api/:storeId/products/:productId/image", images);
app.use("/api/order", orders);

app.use(morganMiddleware);

app.listen(port, () => {
  logger.info(`Listening on port: ${port}`);
});
