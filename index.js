const express = require("express");
const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello There");
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
