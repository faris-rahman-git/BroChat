import { useCallInviteForm } from '@client/hooks/home/callHooks/logic/useCallInviteForm';
import { selectGroupChatById } from '@client/redux/selectors/groupChatSelectors';
import { RootState } from '@client/redux/store';
import { getUrlParams } from '@client/utils/getUrlParams';
import { randomID } from '@client/utils/randomID';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const useChatPanelTopHook = (isGroup: boolean) => {
  const receiverDetails = useSelector(
    (state: RootState) => state.activeReceiver
  );
  const group = useSelector(
    selectGroupChatById(receiverDetails.conversationId!)
  );
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const { mutateCallInvite } = useCallInviteForm();

  const handleCalls = (label: string) => {
    const isVideoCall = label == 'Video call' ? true : false;
    const roomID = getUrlParams().get('roomID') || randomID(10);
    const params = new URLSearchParams({
      isVideoCall: String(isVideoCall),
    });
    const callUrl = `/call/${encodeURIComponent(roomID)}?${params.toString()}`;
    mutateCallInvite({
      isVideoCall,
      initiatedAt: new Date(),
      conversationId: receiverDetails.conversationId!,
      callUrl,
      roomId: roomID,
      isGroupCall: isGroup,
    });
  };

  return {
    openInfoModal,
    setOpenInfoModal,
    showThankYouModal,
    setShowThankYouModal,
    handleCalls,
    group ,
    receiverDetails
  };
};
