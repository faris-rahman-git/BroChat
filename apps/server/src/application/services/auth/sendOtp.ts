import { sendOtpEmail } from '../../../infrastructure/services/authServices/sendMail';
import { saveOtp } from '../../../infrastructure/services/redis/otpManagement';
import { generateOtp } from '../../../utils/auth/generateOtp';

export const sendOtp = async (email: string): Promise<void> => {
  const otp = generateOtp();
  await sendOtpEmail(email, otp);
  await saveOtp(email, otp);
};
