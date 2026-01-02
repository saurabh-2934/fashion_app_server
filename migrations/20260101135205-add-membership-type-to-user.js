"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "membership_type", {
      type: Sequelize.ENUM("free", "prime"),
      allowNull: false,
      defaultValue: "free",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "membership_type");
  },
};
