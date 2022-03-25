require("dotenv").config();
const {
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  SECRET_KEY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  VERIFICATION_SECRET,
} = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "storeroom_database_dev",
    host: DB_HOST,
    dialect: "postgres",
    rtSecret: REFRESH_TOKEN_SECRET,
    atSecret: ACCESS_TOKEN_SECRET,
    secret: SECRET_KEY,
    veriSecret: VERIFICATION_SECRET,
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "storeroom_database_test",
    host: DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "storeroom_database_prod",
    host: DB_HOST,
    dialect: "postgres",
  },
};
