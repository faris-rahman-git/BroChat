import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { MdAttachFile } from 'react-icons/md';
import { ContentType } from '@bro/shared';
import ChatInputControls from './chatPanelBottom/ChatInputControls';
import AttachmentOptionsModal from './chatPanelBottom/AttachmentOptionsModal';
import EmojiGifPickerPanel from './chatPanelBottom/EmojiGifPickerPanel';
import HiddenFileInput from './chatPanelBottom/HiddenFileInput';
import { useChatPanelBottomHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatPanel/element/useChatPanelBottomHook';

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
    isRecording,
    recordingTime,
    handleMicClick,
    stopRecording,
    showAttachmentModal,
    setShowAttachmentModal,
    fileInputType,
    hiddenFileInputRef,
    handleFileSelect,
    handleFileChange,
    isSending,
  } = useChatPanelBottomHook(onSend, receiverId);

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
