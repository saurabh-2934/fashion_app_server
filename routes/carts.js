const express = require("express");
const controller = require("../controllers/cart.controller");
const authorize = require("../middleware/check_auth");

const routes = express.Router();

routes.post("/add-item/:product_id", authorize, controller.addItemInCart);
routes.get("/get-cart/", authorize, controller.getCart);
routes.delete("/delete/:id", authorize, controller.deleteCart);
routes.delete("/deleteAll", authorize, controller.deleteAllCart);
routes.put("/quantity-update/", authorize, controller.incereaseOrDecrease);

module.exports = routes;
