import { text } from "express";
import Mailgen from "mailgen";
import { Resend } from "resend";

const sendEmail = async (options) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Lamp Login Authentication",
      link: "https://github.com/Rohan-Korake/backend-foundation",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailGenContent); // Useful if email clients don’t support HTML.
  const emailHtml = mailGenerator.generate(options.mailGenContent); //Generates the HTML version of the email

  //  handle the error
  try {
    // // Mail options for sending email using resend mail
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: options.email,
      subject: options.subject,
      text: emailTextual,
      html: emailHtml,
    });
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// generate email verification template
const emailVerificationMailContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro:
        "Welcome! Please verify your email address to activate your account.",
      action: {
        instruction: "Click the button below to verify your email address.",
        button: {
          color: "#2563EB",
          text: "Verify Email",
          link: verificationUrl,
        },
      },
      outro:
        "If you did not create this account, you can safely ignore this email.",
    },
  };
};

// generate Reset password template
const forgotPasswordMailContent = (username, forgotPasswordUrl) => {
  return {
    body: {
      name: username,
      intro: "We received a request to reset the password for your account.",
      action: {
        instruction: "Click the button below to create a new password.",
        button: {
          color: "#2563EB",
          text: "Reset Password",
          link: forgotPasswordUrl,
        },
      },
      outro:
        "If you did not request a password reset, you can safely ignore this email. This link will expire shortly for security reasons.",
    },
  };
};

export { emailVerificationMailContent, forgotPasswordMailContent, sendEmail };
