const express = require("express");

const users = require("./routes/user");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/users", users);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
