import nodemailer from "nodemailer";

const sendMail = async (email, subject, message) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    secure: process.env.SECURE,
    auth: {
      user: process.env.SMTP_MAIL,
      password: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Ecommerce" ${process.env.SMTP_MAIL}`,
    to: email,
    subject: subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
