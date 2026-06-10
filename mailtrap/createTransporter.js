const nodemailer = require("nodemailer");
require("dotenv").config()


const createMailTransport =()=>{
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service:process.env.SERVICE,
        post:Number(process.env.EMAIL_PORT),
        secure:Boolean(process.env.SECURE),
        auth: {
          user: "jobfinder0205@gmail.com",
          pass: process.env.EMAIL_PASS,
        },
      });
      return transporter
}

module.exports = {createMailTransport}