const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendTicketEmail = async (to, subject, text) => {
  if (!to) return;

  await transporter.sendMail({
    from: `"Travel Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};
