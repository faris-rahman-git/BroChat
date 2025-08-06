import React from 'react';

interface HiddenFileInputProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  accept: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const HiddenFileInput = React.memo(
  ({ fileInputRef, accept, onChange }: HiddenFileInputProps) => {
    return (
      <input
        type="file"
        ref={fileInputRef}
        accept={accept || '*/*'}
        style={{ display: 'none' }}
        onChange={onChange}
      />
    );
  }
);

export default HiddenFileInput;
