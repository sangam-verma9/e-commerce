const express = require("express");
const cookiep = require("cookie-parser");
const app = express();
app.use(express.json());

app.use(cookiep());

const product = require("./routes/prodectRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const errormiddleware = require("./middleware/error");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
//error middleware use
app.use(errormiddleware);

module.exports = app;
