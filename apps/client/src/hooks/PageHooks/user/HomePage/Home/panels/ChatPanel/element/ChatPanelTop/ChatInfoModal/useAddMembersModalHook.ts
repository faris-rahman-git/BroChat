import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';
import { GroupFixedData, SearchResultType } from '@bro/shared';
import { useEffect, useState } from 'react';
import { useAddGroupMembersForm } from '@client/hooks/home/groupHooks/logic/useAddGroupMembersForm';

export const useAddMembersModalHook = (
  onOpenChange: (open: boolean) => void,
  conversationId: string,
  existingMemberIds: string[],
  isPaid: boolean
) => {
  const userList = useSelector(
    (state: RootState) => state.oneToOneChat.chatList
  );
  const [allUsers, setAllUsers] = useState<SearchResultType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { mutate } = useAddGroupMembersForm();

  useEffect(() => {
    const filtered = userList.filter(
      (user) => !existingMemberIds.includes(user.receiverId)
    );
    setAllUsers(filtered);
  }, [existingMemberIds, userList]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      const alreadySelected = prev.includes(userId);
      if (alreadySelected) {
        return prev.filter((id) => id !== userId);
      }

      // Enforce limit if group is not paid
      const total = existingMemberIds.length + prev.length;
      if (!isPaid && total >= GroupFixedData.Member_limit) {
        return prev;
      }

      return [...prev, userId];
    });
  };

  const isSelected = (userId: string) =>
    selectedUsers.some((id) => id === userId);

  const handleAddMembers = () => {
    onOpenChange(false);
    mutate({ conversationId, newMembersId: selectedUsers });
    setSelectedUsers([]);
  };

  return{
    allUsers,
    selectedUsers,
    toggleUserSelection,
    isSelected,
    handleAddMembers
  }
};
