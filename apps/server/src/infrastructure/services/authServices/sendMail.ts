import nodemailer from 'nodemailer';
import AppError from '../../errors/AppError';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certs
  },
});

export const sendOtpEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: 'BroChat OTP Verification',
    text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    throw new AppError('Failed to send OTP email', 500);
  }
};
