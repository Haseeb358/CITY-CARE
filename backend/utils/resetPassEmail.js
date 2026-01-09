import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config();

let transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

let sendResetEmail = async (opt) => {
  try {
    const info = await transporter.sendMail({
      from: "citycareforyou@gmail.com",
      to: opt.to,
      subject: opt.subject,
      template: "resetEmail",
      text: `Hello ${opt.name},\n\nPlease click on the following link to reset your password:\n\n${opt.resetUrl}\n\nIf you did not request this, please ignore this email.\n\nThank you,\nCityCare Team`,

    });
    console.log("Message sent:", info.messageId);
    
  } catch (error) {
    throw error;
  }
};
export {sendResetEmail};