import redis from '../../../config/redis';

export const saveOtp = async (email: string, otp: string) => {
  await redis.set(`otp:${email}`, otp, 'EX', 120);
};

export const getOtp = async (email: string) => {
  const storedOtp = await redis.get(`otp:${email}`);
  return storedOtp;
};
