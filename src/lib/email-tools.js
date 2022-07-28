/** @format */

import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendRegistrationEmail = async (recipientAddress) => {
  try {
    const msg = {
      to: recipientAddress,
      from: process.env.SENDER_EMAIL,
      subject: "This is my very first email with Sendgrid! yeeeeeeeeee",
      text: "bla bla bla",
      html: "<strong>bla bla bla but in bold</strong>",
    }
    await sgMail.send(msg)
  } catch (error) {
    console.log(error)
  }
}
