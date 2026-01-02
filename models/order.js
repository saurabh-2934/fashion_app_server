"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: "items",
      });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: DataTypes.INTEGER,
      total_amount: DataTypes.DECIMAL(10, 2),
      status: DataTypes.STRING,
      razorpay_order_id: DataTypes.STRING,
      razorpay_payment_id: DataTypes.STRING,
      razorpay_signature: DataTypes.STRING,
      payment_status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
    }
  );

  return Order;
};
