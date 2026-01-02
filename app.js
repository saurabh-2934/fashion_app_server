const express = require("express");
const cors = require("cors");

const app = express();
const userRoute = require("./routes/user");
const passwordRoute = require("./routes/forgotPassword");
const product = require("./routes/products");
const cart = require("./routes/carts");
const checkout = require("./routes/payment");

app.use(cors());
app.use(express.json());

app.use("/user/", userRoute);
app.use("/forgot-password/", passwordRoute);
app.use("/products/", product);
app.use("/cart/", cart);
app.use("/order/", checkout);

module.exports = app;
