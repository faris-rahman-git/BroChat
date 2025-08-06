export interface IPasswordService {
  generatePassword(plainPassword: string): Promise<string>;
  validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
