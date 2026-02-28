import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

/**
 * SMTP Transporter (singleton)
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true only if using port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Verify SMTP connection on server start
 */
transporter.verify((err) => {
  if (err) {
    console.error("❌ Email server connection failed:", err.message);
  } else {
    console.log("✅ Email server ready");
  }
});

/**
 * Send Email Utility
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"InternStatus" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || "Please view this email in an HTML supported client.",
    });

    return info;
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    throw err;
  }
};

export default sendEmail;