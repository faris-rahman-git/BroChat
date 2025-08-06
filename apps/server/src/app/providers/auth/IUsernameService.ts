export interface IUsernameService {
  generateUniqueUsername(name: string): Promise<string>;
}
