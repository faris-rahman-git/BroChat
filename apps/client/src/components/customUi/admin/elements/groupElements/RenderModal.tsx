import React from 'react';
import { GroupChatType } from '@bro/shared';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import { getPageNumber } from '@client/utils/getPageNumber';

function RenderModal({
  selectedGroup,
  setSelectedGroup,
  setOpenModal,
  openModal,
  currentPage,
  groupList,
  setCurrentPage,
  selectedButton,
  handleBlockGroup,
  handleSoftDeleteUser,
}: {
  selectedGroup: GroupChatType | null;
  setSelectedGroup: (rowData: GroupChatType | null) => void;
  setOpenModal: (openModal: boolean) => void;

  openModal: boolean;
  currentPage: number;
  groupList: GroupChatType[];
  setCurrentPage: (page: number) => void;
  selectedButton: 'block' | 'delete' | '';
  handleBlockGroup: (conversationId: string, isBlocked: boolean) => void;
  handleSoftDeleteUser: (conversationId: string) => void;
}) {
  if (!selectedGroup) return null;

  return (
    <CustomModals
      open={openModal}
      onOpenChange={(val) => {
        if (!val) setSelectedGroup(null);
        setOpenModal(val);
      }}
      onConfirm={() => {
        if (!selectedGroup) return;
        const conversationId = selectedGroup._id as string;
        const pagenumber = getPageNumber(currentPage, groupList.length);
        setCurrentPage(pagenumber);

        if (selectedButton === 'block') {
          handleBlockGroup(conversationId, selectedGroup.isBlocked);
        } else if (selectedButton === 'delete') {
          handleSoftDeleteUser(conversationId);
        }
      }}
      title={
        selectedButton === 'block'
          ? selectedGroup.isBlocked
            ? 'Unblock Group'
            : 'Block Group'
          : 'Delete Group'
      }
      description={
        selectedButton === 'block'
          ? `Confirm that you want to ${
              selectedGroup?.isBlocked ? 'unblock' : 'block'
            } this Group. This action can be undone.`
          : 'Confirm that you want to delete this Group. This action can be undone.'
      }
      confirmText="Confirm"
    />
  );
}

export default React.memo(RenderModal);
