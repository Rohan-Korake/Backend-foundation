import { text } from "express";
import Mailgen from "mailgen";
import nodeMailer from "nodemailer";
import { user } from "../models/user.models";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Backend testing",
      link: "https://github.com/Rohan-Korake/backend-foundation",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailGenContent); // Useful if email clients don’t support HTML.
  const emailHtml = mailGenerator.generate(options.mailGenContent); //Generates the HTML version of the email

  // Responsible for sending emails.
  const transporter = nodeMailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  // Mail options for sending email using Nodemailer
  const mail = {
    from: "backendfoundation@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.emailTextual,
    html: options.emailHtml,
  };

  //  handle the error
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email sending error", error);
  }
};

// generate email verification template
const emailVerificationMailContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our application and we are happy to connect with you",
      action: {
        instruction: "To verify user email please click on following button",
        button: {
          color: "#d2ee19",
          text: "Verify Email",
          link: verificationUrl,
        },
      },
      outro:
        "Please complete this process and feel free to ask problems for query",
    },
  };
};

// generate forgot password template
const forgotPasswordMailContent = (username, forgotPasswordUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our application and we are happy to connect with you",
      actions: {
        instruction: "To Reset Password please click on following button",
        button: {
          color: "#c2d20f",
          text: "Forgot Password",
          link: forgotPasswordUrl,
        },
      },
      outro:
        "Please complete this process and feel free to ask problems for query",
    },
  };
};

export { emailVerificationMailContent, forgotPasswordMailContent, sendEmail };
