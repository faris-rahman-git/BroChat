import nodemailer from 'nodemailer';
import { IEmailService } from '../../../app/providers/auth/IEmailService';
import { AuthMessages } from '../../../domain/enums/auth/AuthMessages';

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

export class NodemailerEmailService implements IEmailService {
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'BroChat OTP Verification',
      text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      throw new Error(AuthMessages.MailSendFailed);
    }
  }
}
