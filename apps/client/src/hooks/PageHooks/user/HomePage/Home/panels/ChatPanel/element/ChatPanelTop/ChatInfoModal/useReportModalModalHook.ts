import { useReportUser } from '@client/hooks/home/dmHooks/api/useReportUser';
import { RootState } from '@client/redux/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const useReportModalModalHook = (
  onOpenChange: (open: boolean) => void,
  setOpenBlockModal: (open: boolean) => void,
  checkBlock?: boolean
) => {
  const [reason, setReason] = useState('Spam');
  const [otherText, setOtherText] = useState('');
  const activeReceiver = useSelector(
    (state: RootState) => state.activeReceiver
  );

  const { mutate } = useReportUser();

  const handleConfirm = () => {
    onOpenChange(false);
    if (!checkBlock) {
      setOpenBlockModal(true);
    }

    const finalReason = reason === 'Other' ? otherText.trim() : reason;
    mutate({
      reportedUserId: activeReceiver.receiverId as string,
      conversationId: activeReceiver.conversationId as string,
      reason: finalReason,
    });
  };

  return {
    handleConfirm ,
    reason,
    setReason,
    otherText,
    setOtherText,
  };
};
