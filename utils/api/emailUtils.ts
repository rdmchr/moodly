import nodemailer from "nodemailer";

const baseUrl = process.env.BASE_URL as string;
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string,
  userId: string
) {
  const text = `Hey ${name},\n\n Please verify your email using the link below: \n\n ${baseUrl}/verify?token=${token}&userId=${userId} \n\n This link expires in one hour, if you didn't request this email, please ignore it.`;

  await sendEmail(email, "Please verify your email", text);
}

const host = process.env.SMTP_HOST as string;
const port = process.env.SMTP_PORT as string;
const tls = process.env.SMTP_TLS as string;
const smtpUser = process.env.SMTP_USER as string;
const smtpPassword = process.env.SMTP_PASSWORD as string;
const emailSender = process.env.SMTP_SENDER as string;

async function sendEmail(addressee: string, subject: string, body: string) {
  const transporter = nodemailer.createTransport({
    host: host,
    port: Number(port),
    secure: tls.toLowerCase() === "true",
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    debug: true,
  });

  const mailOptions = {
    from: emailSender,
    to: addressee,
    subject: subject,
    text: body,
  };

  await transporter.sendMail(mailOptions);
}
