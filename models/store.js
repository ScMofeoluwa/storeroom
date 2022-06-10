"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      Store.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
      Store.hasMany(models.Product, {
        foreignKey: "storeId",
        as: "products",
        onDelete: "CASCADE",
      });
    }
  }
  Store.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          len: {
            args: [5, 20],
            msg: "name must be between 5 and 20 characters",
          },
        },
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: "NGN",
        values: ["NGN", "GBP", "USD", "EUR"],
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
