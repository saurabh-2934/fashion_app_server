"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      mobile: DataTypes.STRING,
      otp: DataTypes.STRING,
      expiry_otp: DataTypes.STRING,
      profile_img: DataTypes.STRING,
      prime_user: DataTypes.BOOLEAN,
      membership_type: {
        type: DataTypes.ENUM("free", "Prime", "Prime Lite"),
        defaultValue: "free",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );
  return User;
};
