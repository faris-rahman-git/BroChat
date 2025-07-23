import { SearchResultType } from '@bro/shared';
export const searchUserHelper = (
  users: SearchResultType[],
  searchText: string
) => {
  if (!searchText.trim()) return users;

  const regex = new RegExp(searchText, 'i');

  return users.filter(
    (user) => regex.test(user.username) || regex.test(user.name)
  );
};
