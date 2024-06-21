const express = require("express");
require("dotenv").config();

const cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI + "marvel");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/characters", require("./routes/characters.routes.js"));
app.use("/comics", require("./routes/comics.routes.js"));
app.use("/favorites", require("./routes/favorites.routes.js"));
app.use("/user", require("./routes/user.routes.js"));

app.all("*", (req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server On");
});
