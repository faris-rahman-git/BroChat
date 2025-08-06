export interface IConversationDeleteRepo {
  deleteAllOneToOneConversationByuserId(userId: string): Promise<void>;
  removeUserFromAllGroups(userId: string): Promise<void>;
  softDeleteAConversation(conversationId: string): Promise<void>;
  updateSoftDeleteStatus(
    conversationId: string,
    isDeleted: boolean
  ): Promise<void>;
  hardDeleteAConversation(conversationId: string): Promise<void>;
}
