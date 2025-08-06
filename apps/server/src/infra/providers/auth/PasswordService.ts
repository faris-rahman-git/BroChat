import bcrypt from 'bcrypt';
import { IPasswordService } from '../../../app/providers/auth/IPasswordService';

export class PasswordService implements IPasswordService {
  private saltRounds = 10;

  async generatePassword(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, this.saltRounds);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
