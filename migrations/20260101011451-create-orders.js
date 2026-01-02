"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      razorpay_order_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      razorpay_payment_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      razorpay_signature: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      payment_status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "PENDING",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Orders");
  },
};
