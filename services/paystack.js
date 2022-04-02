const axios = require("axios");

class Paystack {
  async initializePayment(payload) {
    const options = {
      baseURL: "https://api.paystack.co/",
      url: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET}`,
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
        Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET}`,
      },
    };
    const res = await axios(options);
    return res.data;
  }
}

const paystack = new Paystack();
module.exports = paystack;
