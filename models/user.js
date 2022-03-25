"use strict";
const { Model } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];
const jwt = require("jsonwebtoken");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    generateAuthToken() {
      const accessToken = jwt.sign({ id: this.id }, config.atSecret, {
        expiresIn: "2h",
      });
      const refreshToken = jwt.sign({ id: this.id }, config.rtSecret, {
        expiresIn: "2h",
      });
      return { accessToken: accessToken, refreshToken: refreshToken };
    }
    generateVerificationToken() {
      const verificationToken = jwt.sign({ id: this.id }, config.veriSecret, {
        expiresIn: "24h",
      });
      return verificationToken;
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
