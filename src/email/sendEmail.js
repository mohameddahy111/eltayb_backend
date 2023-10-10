import nodemailer from "nodemailer";
import { emailTamplet } from "./emailTamplet.js";

export async function sendVirfiyEmail(option) {
  const transporter = nodemailer.createTransport({ 
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "mohameddahy111@gmail.com",
      pass: "dcxfltirlcjivuyg",
    },
  });

  const info = await transporter.sendMail({
    from: '"test-route" <mohameddahy111@gmail.com>', // sender address
    to:option.email, // list of receivers
    subject: "Verify yor email", // Subject line
    // text: "Hello world?", // plain text body
    html: emailTamplet(option.url) // html body
  });

  console.log("Message sent: %s", info.messageId);

}
