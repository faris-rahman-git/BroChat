import { useState, useRef, useEffect } from 'react';
import { getSocket } from '@client/configs/socket';
import { emitWithQueue } from '@client/lib/socket/emitWithQueue';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { clearEditingMessage } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageEditingSlice';
import { editMessage } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import { ContentType } from '@bro/shared';

interface MessageSubmitArgs {
  content?: string;
  mediaUrl?: string;
  MessageType: ContentType;
}

export const useMessageInputLogic = (
  onSendMessage: (args: MessageSubmitArgs) => void,
  receiverId: string
) => {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const hasEmittedStopRef = useRef(false);

  const dispatch = useAppDispatch();
  const editingMessage = useSelector(
    (state: RootState) => state.editingMessage
  );

  // Sync message input with editingMessage state
  useEffect(() => {
    if (
      editingMessage.conversationId &&
      editingMessage.messageId &&
      editingMessage.message
    ) {
      setMessage(editingMessage.message);
    } else {
      setMessage(''); 
    }
  }, [editingMessage]);

  const emitTypingStatus = (status: 'start' | 'stop') => {
    const socket = getSocket();
    if (!socket) return;

    emitWithQueue({
      event: `${status}-typing`,
      data: { receiverId },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim() === '') {
      // If message is cleared, ensure stop-typing is sent
      if (isTypingRef.current && !hasEmittedStopRef.current) {
        emitTypingStatus('stop');
        hasEmittedStopRef.current = true;
        isTypingRef.current = false;
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      return;
    }

    // Emit start-typing only if not already typing
    if (!isTypingRef.current) {
      emitTypingStatus('start');
      isTypingRef.current = true;
      hasEmittedStopRef.current = false;
    }

    // Clear old timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Reset timeout to emit stop-typing after 2s of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (!hasEmittedStopRef.current) {
        emitTypingStatus('stop');
        hasEmittedStopRef.current = true;
      }
      isTypingRef.current = false;
    }, 2000);
  };

  const handleMessageSubmit = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    if (editingMessage.messageId) {
      // Handle editing existing message
      if (trimmedMessage !== editingMessage.message) {
        emitWithQueue({
          event: 'edit-message',
          data: {
            messageId: editingMessage.messageId,
            conversationId: editingMessage.conversationId,
            message: trimmedMessage,
          },
        });
        dispatch(
          editMessage({
            conversationId: editingMessage.conversationId as string,
            messageId: editingMessage.messageId,
            message: trimmedMessage,
          })
        );
      }
      dispatch(clearEditingMessage());
    } else {
      onSendMessage({
        content: trimmedMessage,
        MessageType: 'text',
      });
    }

    setMessage(''); 

    // Ensure stop-typing is emitted on send/edit
    if (isTypingRef.current || typingTimeoutRef.current) {
      if (!hasEmittedStopRef.current) {
        emitTypingStatus('stop');
        hasEmittedStopRef.current = true;
      }
      isTypingRef.current = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const clearEditState = () => {
    setMessage('');
    dispatch(clearEditingMessage());
  };

  const appendMessage = (text: string) => {
    setMessage((prev) => prev + text);
    if (!isTypingRef.current && text.length > 0) {
      emitTypingStatus('start');
      isTypingRef.current = true;
      hasEmittedStopRef.current = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (!hasEmittedStopRef.current) {
          emitTypingStatus('stop');
          hasEmittedStopRef.current = true;
        }
        isTypingRef.current = false;
      }, 2000);
    } else if (isTypingRef.current && typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (!hasEmittedStopRef.current) {
          emitTypingStatus('stop');
          hasEmittedStopRef.current = true;
        }
        isTypingRef.current = false;
      }, 2000);
    }
  };

  return {
    message,
    handleInputChange,
    handleMessageSubmit,
    isEditing: !!editingMessage.messageId,
    clearEditState,
    appendMessage,
  };
};
