import { useState, useRef } from 'react';
import { ContentType } from '@bro/shared';
import { useFileUploadService } from './useFileUploadService';

interface MessageSubmitArgs {
  content?: string;
  mediaUrl?: string;
  MessageType: ContentType;
}

export const useFileAttachment = (
  onSend: (data: MessageSubmitArgs) => void
) => {
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [fileInputType, setFileInputType] = useState<
    'image/*' | 'video/*' | '*/*' | null
  >(null);
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null); 

  const { uploadFile, isUploading } = useFileUploadService();

  const handleFileSelect = (type: 'image/*' | 'video/*' | '*/*') => {
    setFileInputType(type);
    setShowAttachmentModal(false);
    setTimeout(() => {
      hiddenFileInputRef.current?.click();
    }, 100);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const type: ContentType = file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
        ? 'video'
        : 'document';

      uploadFile(
        {
          file,
          fileType: file.type,
          extension: file.name.split('.').pop() || '',
          customMessageType: type, 
        },
        {
          onSuccess: (data) => {
            onSend({
              mediaUrl: data.mediaUrl,
              MessageType: data.customMessageType, 
            });
          },
        }
      );

      event.target.value = '';
    }
  };

  return {
    showAttachmentModal,
    setShowAttachmentModal,
    fileInputType,
    hiddenFileInputRef,
    handleFileSelect,
    handleFileChange,
    isUploadingFile: isUploading,
  };
};
