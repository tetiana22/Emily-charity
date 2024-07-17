import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { YAHOO_EMAIL, YAHOO_PASSWORD } = process.env;

if (!YAHOO_EMAIL || !YAHOO_PASSWORD) {
  console.error(
    "YAHOO_EMAIL or YAHOO_PASSWORD is not defined in the environment variables."
  );
  process.exit(1);
}

const nodemailerConfig = {
  host: "smtp.mail.yahoo.com",
  port: 465,
  secure: true,
  auth: {
    user: YAHOO_EMAIL,
    pass: YAHOO_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: YAHOO_EMAIL };
  try {
    await transport.sendMail(email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
