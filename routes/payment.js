const express = require("express");
const controller = require("../controllers/payment.controller");
const authorize = require("../middleware/check_auth");

const router = express.Router();

router.post("/create-order/", authorize, controller.checkout);
router.post("/checkout", controller.createOrder);

module.exports = router;
