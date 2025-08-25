import { Button } from '@client/components/ui/button';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import ChatTabButton from '@client/components/customUi/commonElemets/ChatTabButton';
import { ForwardData } from '@client/types/user/ChatPanelMiddleType';
import { useForwardModalHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatPanel/element/ChatPanelMiddle/useForwardModalHook';

type MultiForwardModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forwardData: ForwardData[];
  clearSelection?: () => void;
};

const ForwardModal = ({
  open,
  onOpenChange,
  forwardData,
  clearSelection,
}: MultiForwardModalProps) => {
  const { chats, selected, isSelected, toggleSelect, handleForward } =
    useForwardModalHook(onOpenChange, forwardData, clearSelection);

  return (
    <CustomModals
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={() => {}}
      isNormal={false}
    >
      <div>
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold mb-2">Forward Message</h3>
          <p className="text-sm text-gray-500 mx-2 text-center">
            Selected: {selected.size}
          </p>
        </div>

        {/* Chat list */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {chats.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No chats available.
            </p>
          ) : (
            chats.map((chat) => (
              <label
                key={chat.id}
                className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleSelect(chat.id)}
              >
                <input
                  type="checkbox"
                  checked={isSelected(chat.id)}
                  className="w-4 h-4"
                  onChange={() => {}}
                />
                <ChatTabButton
                  avatar={chat.avatar || ''}
                  chatName={chat.name}
                  lastMessageOrUserName={''}
                  className={`flex-1 ${
                    isSelected(chat.id) ? 'bg-blue-100' : ''
                  }`}
                />
              </label>
            ))
          )}
        </div>

        {/* Footer */}
        <Button
          className="mt-4 w-full"
          onClick={handleForward}
          disabled={selected.size === 0}
        >
          Forward ({selected.size})
        </Button>
      </div>
    </CustomModals>
  );
};

export default ForwardModal;
