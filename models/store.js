"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  Store.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        validate: { len: [5, 20] },
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
