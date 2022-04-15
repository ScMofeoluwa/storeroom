const axios = require("axios");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

class Paystack {
  async initializePayment(payload) {
    const options = {
      baseURL: "https://api.paystack.co/",
      url: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.paystackSecret}`,
        "Content-Type": "application/json",
      },
      data: payload,
    };
    const res = await axios(options);
    return res.data.data;
  }

  async verifyPayment(reference) {
    const options = {
      baseURL: "htpps://api.paystack.co/",
      url: `/transaction/verify/${reference}`,
      headers: {
        Authorization: `Bearer ${config.paystackSecret}`,
      },
    };
    const res = await axios(options);
    return res.data;
  }
}

const paystack = new Paystack();
module.exports = paystack;
