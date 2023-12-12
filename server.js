const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const DatabaseConnect = require("./config/db");
const formidableMiddleware = require("express-formidable");
require("dotenv").config();
// rest object
const app = express();
DatabaseConnect();
// rest api

// port
const port = process.env.PORT || 8080;

// middlware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
// app.use(formidableMiddleware());

// routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/category", require("./routes/categoryRoute"));
app.use("/api/v1/product", require("./routes/productRoute"));

app.get("/", (req, res) => {
  res.send({ message: "Get Post Api" });
});

// LISEN
app.listen(port, (req, res) => {
  console.log(`Server is Running on port ${port}`);
});
