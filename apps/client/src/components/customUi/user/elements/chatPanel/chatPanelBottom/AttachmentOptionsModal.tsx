import React from 'react';

interface AttachmentOptionsModalProps {
  onSelectFile: (type: 'image/*' | 'video/*' | '*/*') => void;
}

const AttachmentOptionsModal = React.memo(
  ({ onSelectFile }: AttachmentOptionsModalProps) => {
    return (
      <div className="absolute bottom-[80px] left-6 z-30 bg-white shadow-lg rounded-lg border p-3 w-[200px] space-y-2">
        <button
          onClick={() => onSelectFile('image/*')}
          className="w-full text-left text-sm hover:bg-gray-100 px-3 py-2 rounded"
        >
          📷 Image
        </button>
        <button
          onClick={() => onSelectFile('video/*')}
          className="w-full text-left text-sm hover:bg-gray-100 px-3 py-2 rounded"
        >
          🎬 Video
        </button>
        <button
          onClick={() => onSelectFile('*/*')}
          className="w-full text-left text-sm hover:bg-gray-100 px-3 py-2 rounded"
        >
          📄 Document
        </button>
      </div>
    );
  }
);

export default AttachmentOptionsModal;
