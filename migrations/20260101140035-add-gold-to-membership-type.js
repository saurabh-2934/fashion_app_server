"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      MODIFY COLUMN membership_type
      ENUM('free','Prime','Prime Lite')
      NOT NULL DEFAULT 'free';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      MODIFY COLUMN membership_type
      ENUM('free','prime')
      NOT NULL DEFAULT 'free';
    `);
  },
};
