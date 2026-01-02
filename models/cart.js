"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Cart belongs to User
      Cart.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // Cart belongs to Product
      Cart.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }

  Cart.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "Carts", // matches migration table name
      timestamps: true,
    }
  );

  return Cart;
};
