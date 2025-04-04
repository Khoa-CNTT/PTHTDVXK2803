import dotenv from "dotenv";
import nodemailer, { SentMessageInfo } from "nodemailer";

dotenv.config();

interface SendOtpEmailParams {
  email: string;
  otp: string;
}

const sendOtpEmail = async ({ email, otp }: SendOtpEmailParams): Promise<SentMessageInfo> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for others
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      to: email,
      subject: "Thông tin xác thực email",
      html: getBodyHTMLEmail(otp),
    });

    console.log("Email sent:", info.messageId);
    return info; // Return the sent email information
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email");
  }
};

const getBodyHTMLEmail = (otp: string): string => {
  return `
    <h3>Mã xác thực email: Có thời hạn 5 phút!</h3>
    <p>Vui lòng nhập mã sau để xác minh:</p>
    <div><b>${otp}</b></div>
    <div>Xin chân thành cảm ơn!</div>
  `;
};

export { sendOtpEmail };
