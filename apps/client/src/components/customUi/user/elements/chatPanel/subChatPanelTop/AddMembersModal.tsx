import { useEffect, useState } from 'react';
import { Button } from '@client/components/ui/button';

import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import ChatTabButton from '../../chatList/chatTab/ChatTabButton';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { SearchResultType } from '@bro/shared';
import { useAddGroupMembers } from '@client/hooks/home/groupHooks/useAddGroupMembers';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';

type AddMembersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  existingMemberIds: string[];
};

const AddMembersModal = ({
  open,
  onOpenChange,
  conversationId,
  existingMemberIds,
}: AddMembersModalProps) => {
  const userList = useSelector(
    (state: RootState) => state.oneToOneChat.chatList
  );
  const [allUsers, setAllUsers] = useState<SearchResultType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const { isPending, mutate } = useAddGroupMembers();

  useEffect(() => {
    const filtered = userList.filter(
      (user) => !existingMemberIds.includes(user.receiverId)
    );
    setAllUsers(filtered);
  }, [existingMemberIds, userList]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      const alreadySelected = prev.find((id) => id === userId);
      if (alreadySelected) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  const isSelected = (userId: string) =>
    selectedUsers.some((id) => id === userId);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  const handleAddMembers = () => {
    onOpenChange(false);
    mutate({ conversationId, newMembersId: selectedUsers });
    setSelectedUsers([]);
  };

  return (
    <CustomModals
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={() => {}}
      isNormal={false}
    >
      <div>
        <h3 className="text-lg font-bold mb-2">Add Participants</h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {allUsers.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No users available.
            </p>
          ) : (
            allUsers.map((user) => (
              <ChatTabButton
                key={user.receiverId}
                avatar={user.avatar}
                chatName={user.name}
                lastMessageOrUserName={user.username}
                className={`hover:bg-blue-100 cursor-pointer ${
                  isSelected(user.receiverId) ? 'bg-blue-100' : ''
                }`}
                onClick={() => toggleUserSelection(user.receiverId)}
              />
            ))
          )}
        </div>

        <Button
          className="mt-4 w-full"
          onClick={handleAddMembers}
          disabled={selectedUsers.length === 0}
        >
          Add to Group
        </Button>
      </div>
    </CustomModals>
  );
};

export default AddMembersModal;
