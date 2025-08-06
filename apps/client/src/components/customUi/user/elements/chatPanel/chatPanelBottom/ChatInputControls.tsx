import React from 'react';
import { Input } from '@client/components/ui/input';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { LuCheck, LuMic, LuSendHorizontal, LuSmile, LuX } from 'react-icons/lu';
import RecordingIndicator from './RecordingIndicator';

interface ChatInputControlsProps {
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageSubmit: () => void;
  onToggleEmojiPicker: () => void;
  isEditing: boolean;
  onClearEdit: () => void;
  isRecording: boolean;
  recordingTime: number;
  onMicClick: () => void;
  onStopRecording: () => void;
  isSending: boolean;
}

const ChatInputControls = React.memo(
  ({
    message,
    onMessageChange,
    onMessageSubmit,
    onToggleEmojiPicker,
    isEditing,
    onClearEdit,
    isRecording,
    recordingTime,
    onMicClick,
    onStopRecording,
    isSending,
  }: ChatInputControlsProps) => {
    return (
      <div className="flex-1 relative h-12">
        <ButtonIcon
          Icon={LuSmile}
          label={'Smile'}
          iconClassName="size-5"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 p-0 hover:bg-white"
          onClick={onToggleEmojiPicker}
          disabled={isSending || isRecording}
        />

        <Input
          value={message}
          onChange={onMessageChange}
          className="h-full px-[60px] text-[30px] py-2.5 rounded-[6px] border-2 border-gray-300 focus-visible:ring-0 focus-visible:border-[#615EF0]"
          placeholder="Type a message"
          onKeyDown={(e) => e.key === 'Enter' && onMessageSubmit()}
          disabled={isSending || isRecording}
        />

        {isRecording && <RecordingIndicator recordingTime={recordingTime} />}

        {isEditing && (
          <ButtonIcon
            Icon={LuX}
            label={'Clear Edit'}
            iconClassName="size-5"
            className="absolute right-[50px] top-1/2 transform -translate-y-1/2 bg-[#F3F3F3] p-0 hover:bg-white text-[#615EF0] hover:text-[#615EF0]"
            onClick={onClearEdit}
          />
        )}

        {isRecording ? (
          <ButtonIcon
            Icon={LuSendHorizontal}
            label="Stop Recording"
            iconClassName="size-5 text-red-600"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 hover:bg-white"
            onClick={onStopRecording}
          />
        ) : message.trim() ? (
          <ButtonIcon
            Icon={isEditing ? LuCheck : LuSendHorizontal}
            label={'Send'}
            iconClassName="size-5"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 hover:bg-white text-[#615EF0] hover:text-[#615EF0]"
            onClick={onMessageSubmit}
            disabled={isSending}
          />
        ) : (
          <ButtonIcon
            Icon={LuMic}
            label={'Mic'}
            iconClassName="size-5"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 hover:bg-white"
            onClick={onMicClick}
            disabled={isSending}
          />
        )}
      </div>
    );
  }
);

export default ChatInputControls;
