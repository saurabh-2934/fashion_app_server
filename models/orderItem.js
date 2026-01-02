"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: "order_id",
      });

      OrderItem.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
    }
  }

  OrderItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "OrderItems",
    }
  );

  return OrderItem;
};
