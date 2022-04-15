const nodemailer = require("nodemailer");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

const sendMail = (user, verificationToken) => {
  const url = `http://localhost:3000/api/verify/${verificationToken}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.mailUser,
      pass: config.mailPass,
    },
  });

  const mailOptions = {
    from: "StoreRoom",
    to: user.email,
    subject: "Verify account",
    html: `Click <a href = '${url}'>here</a> to confirm your email.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info.response);
    }
  });
};

exports.sendMail = sendMail;
