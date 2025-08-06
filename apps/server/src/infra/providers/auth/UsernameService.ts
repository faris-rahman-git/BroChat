import { IUsernameService } from '../../../app/providers/auth/IUsernameService';
import { IUserReadRepo } from '../../../app/repositories/user/IUserReadRepo';

export class UsernameService implements IUsernameService {
  constructor(private userReadRepo: IUserReadRepo) {}

  private generateUsername(name: string): string {
    const base = name.trim().toLowerCase().replace(/\s+/g, '_');
    const randomNum = Math.floor(Math.random() * 10000);
    return `${base}_${randomNum}`;
  }

  async generateUniqueUsername(name: string): Promise<string> {
    let username = '';
    let isTaken: string | boolean | null = true;

    while (isTaken) {
      username = this.generateUsername(name);
      isTaken = await this.userReadRepo.findUsername(username);
    }

    return username;
  }
}
