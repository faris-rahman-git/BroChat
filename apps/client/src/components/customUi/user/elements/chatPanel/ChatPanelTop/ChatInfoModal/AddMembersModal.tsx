import { Button } from '@client/components/ui/button';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import ChatTabButton from '@client/components/customUi/commonElemets/ChatTabButton';
import { GroupFixedData } from '@bro/shared';
import { useAddMembersModalHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatPanel/element/ChatPanelTop/ChatInfoModal/useAddMembersModalHook';

type AddMembersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  existingMemberIds: string[];
  isPaid: boolean;
};

const AddMembersModal = ({
  open,
  onOpenChange,
  conversationId,
  existingMemberIds,
  isPaid,
}: AddMembersModalProps) => {
  const {
    allUsers,
    selectedUsers,
    toggleUserSelection,
    isSelected,
    handleAddMembers,
  } = useAddMembersModalHook(
    onOpenChange,
    conversationId,
    existingMemberIds,
    isPaid
  );

  return (
    <CustomModals
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={() => {}}
      isNormal={false}
    >
      <div>
        <div>
          <h3 className="text-lg font-bold mb-2">Add Participants</h3>
          <p className="text-sm text-gray-500 mx-2 text-center">
            Selected: {selectedUsers.length}
            {isPaid
              ? ''
              : ' / ' +
                (GroupFixedData.Member_limit - existingMemberIds.length)}
          </p>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {allUsers.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No users available.
            </p>
          ) : (
            allUsers.map((user) => {
              const totalCount =
                existingMemberIds.length + selectedUsers.length;
              const isLimitReached =
                !isPaid && totalCount >= GroupFixedData.Member_limit;
              const isDisabled = !isSelected(user.receiverId) && isLimitReached;

              return (
                <div
                  key={user.receiverId}
                  className={`${isDisabled ? 'opacity-40' : 'opacity-100'}`}
                  onClick={() =>
                    !isDisabled && toggleUserSelection(user.receiverId)
                  }
                >
                  <ChatTabButton
                    avatar={user.avatar}
                    chatName={user.name}
                    lastMessageOrUserName={user.username}
                    className={`${
                      !isDisabled ? 'hover:bg-blue-100 cursor-pointer' : ''
                    } ${isSelected(user.receiverId) ? 'bg-blue-100' : ''}`}
                  />
                </div>
              );
            })
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
