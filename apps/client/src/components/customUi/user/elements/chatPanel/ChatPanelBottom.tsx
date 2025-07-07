import { useRef, useState } from 'react';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { Input } from '@client/components/ui/input';
import { LuMic, LuSendHorizontal, LuSmile } from 'react-icons/lu';
import { MdAttachFile } from 'react-icons/md';
import { getSocket } from '@client/configs/socket';
import { emitWithQueue } from '@client/lib/socket/emitWithQueue';

function ChatPanelBottom({
  onSend,
  receiverId,
}: {
  onSend: (message: string) => void;
  receiverId: string;
}) {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const hasEmittedStopRef = useRef(false);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    if (value.trim() === '') return;

    const socket = getSocket();
    if (!socket) return;

    // emit start-typing only if not already typing
    if (!isTypingRef.current) {
      emitWithQueue({
        event: 'start-typing',
        data: {
          receiverId,
        },
      });
      isTypingRef.current = true;
      hasEmittedStopRef.current = false;
    }

    // clear old timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // reset timeout to emit stop-typing after 2s of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (!hasEmittedStopRef.current) {
        emitWithQueue({
          event: 'stop-typing',
          data: {
            receiverId,
          },
        });
        hasEmittedStopRef.current = true;
      }
      isTypingRef.current = false;
    }, 2000);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
      const socket = getSocket();
      if (!socket) return;

      // ensure stop-typing is emitted on send
      if (isTypingRef.current && !hasEmittedStopRef.current) {
        emitWithQueue({
          event: 'stop-typing',
          data: {
            receiverId,
          },
        });
        hasEmittedStopRef.current = true;
        isTypingRef.current = false;
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  return (
    <footer className="flex items-center gap-6 p-6">
      <ButtonIcon
        Icon={MdAttachFile}
        label={'File'}
        iconClassName="size-6"
        className="hover:bg-white"
      />

      <div className="flex-1 relative h-12">
        <ButtonIcon
          Icon={LuSmile}
          label={'Smile'}
          iconClassName="size-5"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 p-0 hover:bg-white"
        />

        <Input
          value={message}
          onChange={handleTyping}
          className="h-full px-[60px] py-2.5 rounded-[6px] border-2 border-gray-300 focus-visible:ring-0 focus-visible:border-[#615EF0]"
          placeholder="Type a message"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        {message.trim() ? (
          <ButtonIcon
            Icon={LuSendHorizontal}
            label={'Send'}
            iconClassName="size-5"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 hover:bg-white text-[#615EF0] hover:text-[#615EF0]"
            onClick={handleSend}
          />
        ) : (
          <ButtonIcon
            Icon={LuMic}
            label={'Mic'}
            iconClassName="size-5"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 hover:bg-white"
          />
        )}
      </div>
    </footer>
  );
}

export default ChatPanelBottom;
