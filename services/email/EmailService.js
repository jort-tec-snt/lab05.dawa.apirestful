const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY,
      },
    });
  }

  sendEmail(options) {
    const { to, subject, htmlBody } = options;

    this.transporter
      .sendMail({
        from: process.env.MAILER_EMAIL,
        to,
        subject,
        html: htmlBody,
      })
      .then((info) => {
        console.log("Email enviado:", info.response);
      })
      .catch((error) => {
        console.error("Error enviando el email:", error.message);
      });
  }
}

module.exports = EmailService;