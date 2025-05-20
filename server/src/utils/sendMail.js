import nodemailer from "nodemailer"
import { env } from "~/config/environment"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.MAIL_ACCOUNT,
    pass: env.MAIL_PASSWORD,
  }
});

export const sendEmail = async (formName, receivers, subject, html) => {
  try {
    await transporter.sendMail({
      from: formName, // sender address
      to: receivers, // list of receivers
      subject: subject, // Subject line
      html: html// html body
    })
  } catch (error) {
    throw new Error(error)
  }

}
