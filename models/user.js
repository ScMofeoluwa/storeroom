"use strict";
const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    generateAuthToken() {
      const access_token = jwt.sign({ id: this.id }, config.atSecret, {
        expiresIn: "2h",
      });
      const refresh_token = jwt.sign({ id: this.id }, config.rtSecret, {
        expiresIn: "2h",
      });
      return { access_token: access_token, refresh_token: refresh_token };
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [5, 20],
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          len: [5, 255],
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
