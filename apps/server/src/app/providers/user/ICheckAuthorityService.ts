export interface ICheckAuthorityService {
  checkIsAdmin(conversationId: string, userId: string): Promise<boolean>;
}
