import { ContentType } from '@bro/shared';
import { useMessageInputLogic } from './ChatPanelBottomHook/useMessageInputLogic';
import { useEmojiStickerPicker } from './ChatPanelBottomHook/useEmojiStickerPicker';
import { useVoiceRecording } from './ChatPanelBottomHook/useVoiceRecording';
import { useFileAttachment } from './ChatPanelBottomHook/useFileAttachment';

export const useChatPanelBottomHook = (
  onSend: ({
    content,
    mediaUrl,
    MessageType,
  }: {
    content?: string;
    mediaUrl?: string;
    MessageType: ContentType;
  }) => void,
  receiverId: string
) => {
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

  return {
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
  };
};
