const express = require("express");
const error = require("./middleware/error");

const register = require("./routes/register");
const login = require("./routes/login");
const stores = require("./routes/store");
const verify = require("./routes/verifyAccount")

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/verify", verify)
app.use("/api/stores", stores);

app.use(error);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
