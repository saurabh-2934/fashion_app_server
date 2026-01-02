const models = require("../models");
const { Op } = require("sequelize");

const getProduct = async (request, response) => {
  try {
    const { id } = request;
    const {
      search_q = "",
      category,
      rating,
      order = "ASC", // default order
    } = request.query;

    const user = await models.User.findByPk(id);

    // ---------------- BUILD WHERE ----------------
    const whereCondition = {};

    // search
    if (search_q && search_q !== "undefined" && search_q.trim() !== "") {
      whereCondition.description = {
        [Op.like]: `%${search_q.trim()}%`,
      };
    }

    // category
    if (category) {
      whereCondition.category = category;
    }

    // rating >=
    if (rating) {
      whereCondition.rating = {
        [Op.gte]: Number(rating),
      };
    }

    // non-prime users restriction
    if (!user.prime_user) {
      whereCondition.is_prime_only = false;
    }

    // ---------------- BUILD ORDER ----------------
    const orderCondition = [];

    if (order) {
      orderCondition.push(["price", order.toUpperCase()]);
    }

    // ---------------- FINAL QUERY ----------------
    const allProducts = await models.Product.findAll({
      where: whereCondition,
      order: orderCondition,
    });

    return response.status(200).json({ data: allProducts });
  } catch (e) {
    return response.status(500).json({ error_msg: e.message });
  }
};

const productDetails = async (request, response) => {
  try {
    const { productId } = request.params;
    const { id } = request;

    const user = await models.User.findByPk(id);

    if (user.prime_user) {
      const specificProduct = await models.Product.findOne({
        where: {
          id: productId,
        },
      });

      const totalCount = await models.Product.count({
        where: {
          id: {
            [Op.ne]: productId,
          },
          category: specificProduct.category,
        },
      });

      const randomOffset = Math.max(
        0,
        Math.floor(Math.random() * (totalCount - 4))
      );

      const similarProduct = await models.Product.findAll({
        where: {
          id: {
            [Op.ne]: productId,
          },
          category: specificProduct.category,
        },
        limit: 4,
        offset: randomOffset,
      });

      const productResponse = {
        specificProduct,
        similarProduct,
      };
      return response.status(200).json({ data: productResponse });
    } else {
      const specificProduct = await models.Product.findOne({
        where: {
          id: productId,
        },
      });

      const totalCount = await models.Product.count({
        where: {
          id: {
            [Op.ne]: productId,
          },
          category: specificProduct.category,
          is_prime_only: false,
        },
      });

      const randomOffset = Math.max(
        0,
        Math.floor(Math.random() * (totalCount - 4))
      );

      const similarProduct = await models.Product.findAll({
        where: {
          id: {
            [Op.ne]: productId,
          },
          category: specificProduct.category,
          is_prime_only: false,
        },
        limit: 4,
        offset: randomOffset,
      });

      const productResponse = {
        specificProduct,
        similarProduct,
      };
      return response.status(200).json({ data: productResponse });
    }
  } catch (e) {
    response.status(500).json({ error_msg: e.message });
  }
};

module.exports = {
  getProduct: getProduct,
  productDetails: productDetails,
};
