import { IOtpManagementRepo } from '../../../app/repositories/redis/IOtpManagementRepo';
import redis from '../../databases/redis/redisConnection';

export class OtpManagementRepo implements IOtpManagementRepo {
  async saveOtp(email: string, otp: string): Promise<void> {
    await redis.set(`otp:${email}`, otp, 'EX', 120);
  }

  async getOtp(email: string): Promise<string | null> {
    const storedOtp = await redis.get(`otp:${email}`);
    return storedOtp;
  }
}
