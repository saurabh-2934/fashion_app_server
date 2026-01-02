"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      title: DataTypes.STRING,
      brand: DataTypes.STRING,
      category: DataTypes.STRING,
      reviews: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      rating: DataTypes.FLOAT,
      image_url: DataTypes.TEXT,
      is_prime_only: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products", // ✅ VERY IMPORTANT
      timestamps: true,
    }
  );
  return Product;
};
