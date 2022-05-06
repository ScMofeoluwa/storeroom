require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "storeroom_database_dev",
    host: process.env.DB_HOST,
    dialect: "postgres",
    define: {
      timestamps: false,
    },
    secret: process.env.SECRET_KEY,
    rtSecret: process.env.REFRESH_TOKEN_SECRET,
    veriSecret: process.env.VERIFICATION_SECRET,
    paystackCbUrl: process.env.PAYSTACK_CALLBACK_URL,
    paystackSecret: process.env.PAYSTACK_TEST_SECRET,
    cloudinaryKey: process.env.CLOUDINARY_API_KEY,
    cloudinarySecret: process.env.CLOUDINARY_API_SECRET,
    cloudName: process.env.CLOUD_NAME,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "storeroom_database_test",
    host: process.env.DB_HOST,
    dialect: "postgres",
    define: {
      timestamps: false,
    },
    secret: process.env.SECRET_KEY,
    rtSecret: process.env.REFRESH_TOKEN_SECRET,
    veriSecret: process.env.VERIFICATION_SECRET,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: false,
    },
    secret: process.env.SECRET_KEY,
    rtSecret: process.env.REFRESH_TOKEN_SECRET,
    veriSecret: process.env.VERIFICATION_SECRET,
    paystackCbUrl: process.env.PAYSTACK_CALLBACK_URL,
    paystackSecret: process.env.PAYSTACK_LIVE_SECRET,
    cloudinaryKey: process.env.CLOUDINARY_API_KEY,
    cloudinarySecret: process.env.CLOUDINARY_API_SECRET,
    cloudName: process.env.CLOUD_NAME,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
  },
};
