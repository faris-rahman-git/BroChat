export type GetAllGroupParams = {
  searchValue?: string;
  status?: string;
  createdAt?: string;
  page: number;
};

export type BlockGroupParams = {
  conversationId: string;
  isBlocked: boolean;
} & GetAllGroupParams;

export type DeleteGroupParams = {
  conversationId: string;
  isDeleted: boolean;
} & GetAllGroupParams;

export type GetDeletedGroupsParams = {
  searchValue: string;
  page: number;
};

export type hardDeleteGroupParams = {
  conversationId: string;
} & GetDeletedGroupsParams;
