import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import ChatTabButton from '@client/components/customUi/commonElemets/ChatTabButton';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@client/components/ui/context-menu';
import {
  LuArrowBigDownDash,
  LuArrowBigUpDash,
  LuUserPlus,
} from 'react-icons/lu';
import { MdRemoveCircleOutline } from 'react-icons/md';
import { GroupChatListType, GroupFixedData } from '@bro/shared';

function MembersTab({
  userId,
  group,
  handleRemoveMember,
  handleMakeOrDismissAdmin,
  setOpenInviteModal,
}: {
  userId: string;
  group: GroupChatListType | undefined;
  handleRemoveMember: (memberId: string) => void;
  handleMakeOrDismissAdmin: (memberId: string, isAdmin: boolean) => void;
  setOpenInviteModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      <div className="flex justify-between pb-2">
        <h2 className="text-lg font-bold mb-2">
          Members ({group?.participants.length}
          {group?.isPaid ? '' : '/ ' + GroupFixedData.Member_limit})
        </h2>
        {group?.Admins?.includes(userId!) && (
          <ButtonIcon
            Icon={LuUserPlus}
            label="Invite"
            disabled={
              group.participants.length >= GroupFixedData.Member_limit &&
              !group.isPaid
            }
            onClick={() => setOpenInviteModal(true)}
          />
        )}
      </div>
      {group?.participants.map((member) => {
        const isCurrentUser = member._id === userId;
        const isGroupAdmin = group?.Admins?.includes(member._id);

        if (!group?.Admins?.includes(userId!) || isCurrentUser) {
          return (
            <ChatTabButton
              key={member._id}
              avatar={member.avatar}
              chatName={isCurrentUser ? 'You' : member.name}
              avatarFallback={member.name.charAt(0).toUpperCase() || 'U'}
              lastMessageOrUserName={member.username}
              timeOrText={isGroupAdmin ? 'Admin' : ''}
            />
          );
        }

        return (
          <ContextMenu key={member._id}>
            <ContextMenuTrigger>
              <ChatTabButton
                avatar={member.avatar}
                chatName={member.name}
                avatarFallback={member.name.charAt(0).toUpperCase() || 'U'}
                lastMessageOrUserName={member.username}
                timeOrText={isGroupAdmin ? 'Admin' : ''}
              />
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                inset
                onClick={() => handleRemoveMember(member._id)}
              >
                Remove From Group
                <ContextMenuShortcut>
                  <MdRemoveCircleOutline />
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem
                disabled={
                  group?.Admins.length >= GroupFixedData.Admin_limit &&
                  !isGroupAdmin &&
                  !group.isPaid
                }
                inset
                onClick={() =>
                  handleMakeOrDismissAdmin(member._id, isGroupAdmin)
                }
              >
                {isGroupAdmin ? 'Dismiss as Admin' : 'Make Group Admin'}
                <ContextMenuShortcut>
                  {isGroupAdmin ? <LuArrowBigDownDash /> : <LuArrowBigUpDash />}
                </ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
    </div>
  );
}

export default MembersTab;
