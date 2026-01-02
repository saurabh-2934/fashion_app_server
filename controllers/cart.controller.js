const { where } = require("sequelize");
const models = require("../models");
const { response } = require("express");

const addItemInCart = async (request, response) => {
  try {
    const { product_id } = request.params;
    const { quantity } = request.body;
    const { id } = request;

    const cartItems = {
      user_id: id,
      product_id,
      quantity,
    };

    //check for if produc is already in card with same user_id then just increment the id

    const isProductInCart = await models.Cart.findOne({
      where: {
        user_id: id,
        product_id,
      },
    });

    if (!isProductInCart) {
      await models.Cart.create({ user_id: id, product_id, quantity })
        .then((result) => {
          response.status(201).json({ message: `${result} Added to cart` });
        })
        .catch((e) => {
          response.status(400).json({ error_msg: e.message });
        });
    } else {
      await isProductInCart.update({
        quantity: isProductInCart.quantity + quantity,
      });
      response.status(201).json({ message: `Added to cart` });
    }
  } catch (e) {
    response.status(500).json({ error_msg: e.message });
  }
};

const getCart = async (request, response) => {
  try {
    const { id } = request;

    // fetch the product from cart
    const responseDb = await models.Cart.findAll({
      where: {
        user_id: id,
      },
      include: [
        {
          model: models.Product,
          as: "product",
        },
      ],
    });

    response.status(200).json({ data: responseDb });
  } catch (e) {
    response.status(500).json({ error_msg: e.message });
  }
};

const deleteCart = async (request, response) => {
  try {
    const { id } = request.params; // cart id

    await models.Cart.destroy({
      where: {
        id,
      },
    })
      .then(() => {
        response.status(200).json({ message: "deleted" });
      })
      .catch((e) => {
        response.status(400).json({ error_msg: e.message });
      });
  } catch (e) {
    response.status(500).json({ error_msg: e.message });
  }
};

const deleteAllCart = async (request, response) => {
  try {
    const { id } = request; // user id

    await models.Cart.destroy({
      where: {
        user_id: id,
      },
    })
      .then(() => {
        response.status(200).json({ message: "deleted" });
      })
      .catch((e) => {
        response.status(400).json({ error_msg: e.message });
      });
  } catch (e) {
    response.status(500).json({ error_msg: e.message });
  }
};

const incereaseOrDecrease = async (request, response) => {
  try {
    const { cart_id, action } = request.body;

    if (!cart_id || !action) {
      return response.status(400).json({ error_msg: "Invalid request" });
    }

    if (action === "Increment") {
      await models.Cart.increment({ quantity: 1 }, { where: { id: cart_id } });

      return response.status(200).json({ message: "Quantity incremented" });
    }

    if (action === "Decrement") {
      const cartItem = await models.Cart.findByPk(cart_id);

      if (!cartItem) {
        return response.status(404).json({ error_msg: "Cart item not found" });
      }

      if (cartItem.quantity <= 1) {
        return response
          .status(400)
          .json({ error_msg: "Quantity cannot be less than 1" });
      }

      await models.Cart.decrement({ quantity: 1 }, { where: { id: cart_id } });

      return response.status(200).json({ message: "Quantity decremented" });
    }

    return response.status(400).json({ error_msg: "Invalid action" });
  } catch (e) {
    response.status(500).json({ error_msg: e.message });
  }
};

module.exports = {
  addItemInCart: addItemInCart,
  getCart: getCart,
  deleteCart: deleteCart,
  deleteAllCart: deleteAllCart,
  incereaseOrDecrease: incereaseOrDecrease,
};
