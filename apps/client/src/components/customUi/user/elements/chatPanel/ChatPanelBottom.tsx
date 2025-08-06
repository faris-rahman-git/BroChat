import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { MdAttachFile } from 'react-icons/md';
import { ContentType } from '@bro/shared';

import ChatInputControls from './chatPanelBottom/ChatInputControls';
import AttachmentOptionsModal from './chatPanelBottom/AttachmentOptionsModal';
import EmojiGifPickerPanel from './chatPanelBottom/EmojiGifPickerPanel';
import HiddenFileInput from './chatPanelBottom/HiddenFileInput';

import { useMessageInputLogic } from '@client/hooks/home/chatBottomHooks/useMessageInputLogic';
import { useEmojiStickerPicker } from '@client/hooks/home/chatBottomHooks/useEmojiStickerPicker';
import { useVoiceRecording } from '@client/hooks/home/chatBottomHooks/useVoiceRecording';
import { useFileAttachment } from '@client/hooks/home/chatBottomHooks/useFileAttachment';

interface ChatPanelBottomProps {
  onSend: ({
    content,
    mediaUrl,
    MessageType,
  }: {
    content?: string;
    mediaUrl?: string;
    MessageType: ContentType;
  }) => void;
  receiverId: string;
}

function ChatPanelBottom({ onSend, receiverId }: ChatPanelBottomProps) {
  const {
    message,
    handleInputChange,
    handleMessageSubmit,
    isEditing,
    clearEditState,
    appendMessage,
  } = useMessageInputLogic(onSend, receiverId);

  const {
    showPicker,
    setShowPicker,
    pickerRef,
    activeTab,
    setActiveTab,
    searchGifInput,
    setSearchGifInput,
    fetchGifs,
    handleGifClick,
    searchTerm,
  } = useEmojiStickerPicker(onSend);

  const {
    isRecording,
    recordingTime,
    handleMicClick,
    stopRecording,
    isUploadingAudio,
  } = useVoiceRecording(onSend);

  const {
    showAttachmentModal,
    setShowAttachmentModal,
    fileInputType,
    hiddenFileInputRef,
    handleFileSelect,
    handleFileChange,
    isUploadingFile,
  } = useFileAttachment(onSend);

  const isSending = isUploadingAudio || isUploadingFile;

  return (
    <footer className={'flex items-center gap-6 p-6'}>
      <ButtonIcon
        Icon={MdAttachFile}
        label={'File'}
        iconClassName="size-6"
        className="hover:bg-white"
        onClick={() => setShowAttachmentModal(!showAttachmentModal)}
        disabled={isSending || isRecording}
      />

      {showAttachmentModal && (
        <AttachmentOptionsModal onSelectFile={handleFileSelect} />
      )}

      {showPicker && (
        <EmojiGifPickerPanel
          pickerRef={pickerRef}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onEmojiSelect={appendMessage}
          onGifSearchChange={(e) => setSearchGifInput(e.target.value)}
          searchTerm={searchTerm}
          searchGifInput={searchGifInput}
          fetchGifs={fetchGifs}
          onGifSend={handleGifClick}
          disabled={isSending || isRecording}
        />
      )}

      <ChatInputControls
        message={message}
        onMessageChange={handleInputChange}
        onMessageSubmit={handleMessageSubmit}
        onToggleEmojiPicker={() => setShowPicker(!showPicker)}
        isEditing={isEditing}
        onClearEdit={clearEditState}
        isRecording={isRecording}
        recordingTime={recordingTime}
        onMicClick={handleMicClick}
        onStopRecording={stopRecording}
        isSending={isSending}
      />

      <HiddenFileInput
        fileInputRef={hiddenFileInputRef}
        accept={fileInputType}
        onChange={handleFileChange}
      />
    </footer>
  );
}

export default ChatPanelBottom;
