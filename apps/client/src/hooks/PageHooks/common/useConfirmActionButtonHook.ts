import { useState } from 'react';

export const useConfirmActionButtonHook = (onConfirm: () => void) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return {
    open,
    setOpen,
    handleConfirm,
  };
};
