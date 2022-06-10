"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Store, {
        foreignKey: "storeId",
        as: "store",
        onDelete: "CASCADE",
      });
      Product.hasMany(models.Image, {
        foreignKey: "productId",
        as: "images",
        onDelete: "CASCADE",
      });
      Product.belongsToMany(models.Order, {
        through: "ProductOrder",
        as: "orders",
        foreignKey: "productId",
        otherKey: "orderId",
      });
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3, 20],
            msg: "name must be between 3 and 20 characters",
          },
        },
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "minimum price must be 0",
          },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "minimum price must be 0",
          },
        },
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "store ID cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
