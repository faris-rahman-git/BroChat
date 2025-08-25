import { RootState } from '@client/redux/store';
import { ForwardData, ForwardTarget } from '@client/types/user/ChatPanelMiddleType';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { MessageType } from '@bro/shared';
import { appendMessage } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import { changeChatToTop } from '@client/redux/features/userSlices/homeSlices/dmSlices/oneToOneChatSlice';
import { changeGroupChatToTop } from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';
import { getSocket } from '@client/configs/socket';
import { emitWithQueue } from '@client/lib/socket/emitWithQueue';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useForwardModalHook = (
  onOpenChange: (open: boolean) => void,
  forwardData: ForwardData[],
  clearSelection?: () => void
) => {
  const userList = useSelector(
    (state: RootState) => state.oneToOneChat.chatList
  );
  const groupList = useSelector(
    (state: RootState) => state.groupChat.groupList
  );
  const userId = useSelector((state: RootState) => state.user.id);

  const [chats, setChats] = useState<ForwardTarget[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const dispatch = useAppDispatch();

  useEffect(() => {
    const formattedUsers: ForwardTarget[] = userList.map((u) => ({
      id: u.conversationId as string,
      name: u.name,
      avatar: u.avatar,
      username: u.username,
      isGroup: false,
    }));

    const formattedGroups: ForwardTarget[] = groupList.map((g) => ({
      id: g._id,
      name: g.groupName || 'Unnamed Group',
      avatar: g.avatar || undefined,
      isGroup: true,
    }));

    setChats([...formattedUsers, ...formattedGroups]);
  }, [userList, groupList]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const isSelected = (id: string) => selected.has(id);

  const handleForward = async () => {
    try {
      const tasks: Promise<void>[] = [];

      [...selected].map((conversationId) => {
        forwardData.map(({ MessageType, message, mediaUrl, forwardLabel }) => {
          const tempId = uuidv4();
          const newMessage: MessageType = {
            tempId,
            conversationId,
            senderId: userId as string,
            MessageType: MessageType,
            content: message,
            mediaUrl,
            status: 'sending',
            messageTime: new Date().toISOString(),
            isForward: forwardLabel,
          };

          dispatch(
            appendMessage({
              conversationId,
              message: newMessage,
            })
          );
          dispatch(
            changeChatToTop({
              conversationId,
            })
          );
          dispatch(
            changeGroupChatToTop({
              conversationId,
            })
          );

          const socket = getSocket();
          if (!socket) return;

          const task = emitWithQueue({
            event: 'send-message',
            data: newMessage,
          }).catch((err) => {
            console.error('Failed to emit status update:', err);
          });
          tasks.push(task);
        });
      });

      await Promise.all(tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setSelected(new Set());
      onOpenChange(false);
      clearSelection?.();
    }
  };

  return{
    chats,
    selected,
    isSelected,
    toggleSelect,
    handleForward
  }
};
