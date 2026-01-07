import nodemailer from "nodemailer";
import dotenv from "dotenv";
import hbs from "nodemailer-express-handlebars";
import path from "path";

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

let Options = {
  viewEngine: {
    partialsDir: path.resolve("./view"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./view/"),
};

transporter.use("compile", hbs(Options));

let sendEmail = async (opt) => {
  try {
    const info = await transporter.sendMail({
      from: "citycareforyou@gmail.com",
      to: opt.to,
      subject: opt.subject,
      template: "email",
      context: {
        name: opt.name,
        otp: opt.otp,
        company: "CityCare",
      },
      attachments: [
        {
          filename: "logo1.png",
          path: path.join("utils", "../images/logo1.png"),
          cid: "logo@company.com",
        },
        {
          filename: "Linkenin.png",
          path: path.join("utils", "../images/Linkenin.png"),
          cid: "logoLinkenin@company.com",
        },
        {
          filename: "fb.png",
          path: path.join("utils", "../images/fb.png"),
          cid: "logofb@company.com",
        },
        {
          filename: "insta.png",
          path: path.join("utils", "../images/insta.png"),
          cid: "logoinsta@company.com",
        },
        {
          filename: "twitter.png",
          path: path.join("utils", "../images/twitter.png"),
          cid: "logotwitter@company.com",
        },
      ],
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    throw error;
  }
};

export default sendEmail;
