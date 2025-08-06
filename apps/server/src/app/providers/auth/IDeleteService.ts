export interface IDeleteService {
  deleteUserFromAllModels(userId: string): Promise<void>;
}
