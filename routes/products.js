const express = require("express");
const controller = require("../controllers/product.controller");
const authorize = require("../middleware/check_auth");

const routes = express.Router();

routes.get("/all-products", authorize, controller.getProduct);
routes.get("/product-details/:productId", authorize, controller.productDetails);

module.exports = routes;
