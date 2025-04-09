require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_APIKEY);

module.exports = resend;
