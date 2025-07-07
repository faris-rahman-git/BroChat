export type FindEmailAndSaveUserType = {
  _id: string;
  name?: string | null;
  email: string;
  password?: string | null;
  role: string;
  isBlocked ?: boolean;
  isDeleted ?: boolean;
};

export type FindUsernameType = {
  _id: string;
};
