import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import React from 'react';
import GroupDetailsModalContent from './GroupDetailsModalContent';
import { LuBan, LuMenu, LuTrash2 } from 'react-icons/lu';
import { GroupChatType } from '@bro/shared';

function ActionsElement({
  rowData,
  setSelectedGroup,
  setSelectedButton,
  setOpenModal,
}: {
  rowData: GroupChatType;
  setSelectedGroup: (rowData: GroupChatType | null) => void;
  setSelectedButton: (selectedButton: 'block' | 'delete' | '') => void;
  setOpenModal: (openModal: boolean) => void;
}) {
  return (
    <div className="flex gap-4 justify-center items-center">
      {/* Block Button */}
      <ButtonIcon
        Icon={LuBan}
        label={rowData.isBlocked ? 'Unblock' : 'Block'}
        className={`justify-start ps-[9px] ${
          rowData.isBlocked
            ? 'bg-[#54CA68] hover:bg-[#41C457]'
            : 'bg-[#FF5C5C] hover:bg-[#FF4848]'
        }`}
        iconClassName="text-white"
        onClick={() => {
          setSelectedGroup(rowData);
          setSelectedButton('block');
          setOpenModal(true);
        }}
      />

      {/* Delete Button */}
      <ButtonIcon
        Icon={LuTrash2}
        label="Delete"
        className="justify-start ps-[9px] bg-red-700 hover:bg-red-800"
        iconClassName="text-white"
        onClick={() => {
          setSelectedGroup(rowData);
          setSelectedButton('delete');
          setOpenModal(true);
        }}
      />

      <ConfirmActionButton
        buttonIcon={LuMenu}
        buttonClassName={`bg-blue-700 hover:bg-blue-800`}
        buttonContent="Details"
        modalTitle={`User Details`}
        dialogClassName="sm:max-w-[700px]"
        isConfirmButtonDisabled={true}
        onConfirm={() => {}}
      >
        <GroupDetailsModalContent group={rowData} />
      </ConfirmActionButton>
    </div>
  );
}

export default React.memo(ActionsElement);
