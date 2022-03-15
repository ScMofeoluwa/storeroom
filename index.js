const express = require("express");
const error = require("./middleware/error");

const signup = require("./routes/signup");
const signin = require("./routes/signin");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/signup", signup);
app.use("/api/signin", signin);

app.use(error);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
