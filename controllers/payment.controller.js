const { sequelize } = require("../models");
const Razorpay = require("razorpay");
const models = require("../models");
require("dotenv").config();

const checkout = async (request, response) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = request;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      request.body;

    // 🔐 verify payment
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await transaction.rollback();
      return response.status(400).json({ error_msg: "Invalid payment" });
    }

    const cartItems = await models.Cart.findAll({
      where: { user_id: id },
      include: [
        {
          model: models.Product,
          as: "product",
          attributes: ["id", "price"],
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!cartItems.length) {
      await transaction.rollback();
      return response.status(400).json({ error_msg: "Cart empty" });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const order = await models.Order.create(
      {
        user_id: id,
        total_amount: totalAmount,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        payment_status: "DONE",
      },
      { transaction }
    );

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await models.OrderItem.bulkCreate(orderItems, { transaction });

    await models.Cart.destroy({
      where: { user_id: id },
      transaction,
    });

    await transaction.commit();

    return response.status(201).json({
      message: "Order placed successfully",
      order_id: order.id,
    });
  } catch (err) {
    await transaction.rollback();
    return response.status(500).json({ error_msg: err.message });
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error_msg: "Amount is required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // ✅ Send only required fields
    return res.status(201).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({ error_msg: error.message });
  }
};

module.exports = { checkout: checkout, createOrder: createOrder };
