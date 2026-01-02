"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Carts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Users table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products", // Products table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // ✅ OPTIONAL: Prevent same product added twice by same user
    await queryInterface.addConstraint("Carts", {
      fields: ["user_id", "product_id"],
      type: "unique",
      name: "unique_user_product_cart",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Carts");
  },
};
