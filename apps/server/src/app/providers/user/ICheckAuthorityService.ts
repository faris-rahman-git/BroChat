export interface ICheckAuthorityService {
  checkIsAdmin(conversationId: string, userId: string): Promise<boolean>;
  verifyExclusivePlanPayment(userId: string): Promise<boolean>;
}
