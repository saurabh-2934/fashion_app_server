"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderItems", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Orders", // must match table name exactly
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products", // ensure Products.id is INTEGER
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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
    await queryInterface.dropTable("OrderItems");
  },
};
