"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsToMany(models.Product, {
        through: "ProductOrder",
        as: "products",
        foreignKey: "orderId",
        otherKey: "productId",
      });
    }
  }
  Order.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Email must be a valid one",
          },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      txnRef: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
        values: ["pending", "success", "failed"],
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
