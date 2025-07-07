import { FindUsernameType } from '../../../domain/entities/userModelTypes';
import { generateUsername } from '../../../utils/auth/generateUsername';
import { iUserRepo } from '../../interfaces/iUserRepo';

export async function generateUniqueUsername(
  name: string,
  userRepo: iUserRepo
) {
  let username = '';
  let isTaken: FindUsernameType | boolean | null = true;

  while (isTaken) {
    username = generateUsername(name);
    isTaken = await userRepo.findUsername(username);
  }

  return username;
}
