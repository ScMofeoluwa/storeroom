const nodemailer = require("nodemailer");

const sendMail = async (user, verificationToken) => {
  const url = `http://localhost:3000/api/verify/${verificationToken}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: "StoreRoom",
    to: user.email,
    subject: "Verify account",
    html: `Click <a href = '${url}'>here</a> to confirm your email.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    return err;
  }
};

exports.sendMail = sendMail;
