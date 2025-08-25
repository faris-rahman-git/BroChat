import { Card } from '@client/components/ui/card';
import { RefObject } from 'react';
import { Input } from '@client/components/ui/input';
import { GroupFixedData, SearchResultType } from '@bro/shared';
import { Button } from '@client/components/ui/button';
import { LuImagePlus } from 'react-icons/lu';
import ChatTabButton from '@client/components/customUi/commonElemets/ChatTabButton';
import { useCreateNewGroupHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatList/element/Header/useCreateNewGroupHook';

function CreateNewGroup({
  newChatRef,
  setActiveTab,
  oneToOneChatListData,
}: {
  newChatRef: RefObject<HTMLDivElement | null>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  oneToOneChatListData: SearchResultType[];
}) {
  const {
    searchResult,
    selectedUsers,
    groupName,
    step,
    fileInputRef,
    groupAvatarPreview,
    handleSearch,
    toggleUserSelection,
    isSelected,
    resetGroupCreation,
    handleAvatarChange,
    handleCreateGroup,
    setStep,
    setGroupAvatarPreview,
    setGroupName,
  } = useCreateNewGroupHook(setActiveTab, oneToOneChatListData);

  return (
    <Card
      ref={newChatRef}
      className="absolute top-[125%] left-[0] flex flex-col justify-start items-center shadow-md rounded-[6px] bg-[#F3F3F3] w-[300px] h-[500px] z-10"
    >
      <div className="flex flex-col gap-2 w-[90%] h-full">
        <div className="flex items-center justify-between w-full">
          <span className="ps-[9px] text-sm font-semibold">
            Create New Group
          </span>
          {selectedUsers.length > 0 && (
            <span className="text-xs font-normal text-gray-500">
              Selected: {selectedUsers.length}/{GroupFixedData.Member_limit - 1}
            </span>
          )}
        </div>

        {step === 1 ? (
          <>
            <Input
              onChange={handleSearch}
              placeholder="Search Username or Name"
              className="border-0 bg-white rounded-[6px] h-auto p-3 shadow-none focus-visible:ring-0 placeholder:opacity-40 placeholder:text-black text-sm"
            />

            <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar w-full max-h-[370px]">
              {searchResult.map((receiverTab, index) => {
                const isLimitReached =
                  selectedUsers.length + 1 >= GroupFixedData.Member_limit;
                const isDisabled =
                  !isSelected(receiverTab.receiverId) && isLimitReached;

                return (
                  <div
                    key={index}
                    className={`${isDisabled ? 'opacity-40' : 'opacity-100'} `}
                    onClick={() =>
                      !isDisabled && toggleUserSelection(receiverTab)
                    }
                  >
                    <ChatTabButton
                      isAddUser={true}
                      className={`${
                        !isDisabled ? 'hover:bg-white cursor-pointer' : ''
                      } ${
                        isSelected(receiverTab.receiverId) ? 'bg-blue-100' : ''
                      }`}
                      onlineStatus={receiverTab.isOnline}
                      lastMessageOrUserName={receiverTab.username}
                      avatar={receiverTab.avatar || ''}
                      chatName={receiverTab.name || ''}
                    />
                  </div>
                );
              })}
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm hover:cursor-pointer"
                >
                  Next ({selectedUsers.length})
                </Button>
                <Button
                  onClick={resetGroupCreation}
                  variant="outline"
                  className="flex-1 text-sm hover:cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* add group icon and group name */}
            <div className="flex flex-row items-center gap-2 w-full mb-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <div className="w-[70px] h-[70px] rounded-[6px] bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                {groupAvatarPreview ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={groupAvatarPreview}
                      alt="Group Avatar"
                      className="w-full h-full object-cover rounded-[6px]"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs transition-opacity rounded-[6px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="hover:underline mb-1 hover:cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroupAvatarPreview(null);
                        }}
                        className="hover:underline hover:cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    <LuImagePlus className="w-8 h-8" />
                  </div>
                )}
              </div>

              <span className="text-xs text-gray-500 mt-1">
                Add group icon (optional)
              </span>
            </div>
            <div>
              <span className="ps-[9px] text-sm ">Group Name</span>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter Group Name"
                className="border-0 bg-white rounded-[6px] h-auto p-2 shadow-none focus-visible:ring-0 placeholder:opacity-40 placeholder:text-black text-sm"
              />
              {groupName.trim() === '' && (
                <span className="pt-1 text-sm block  text-red-700 text-center">
                  Please enter a group name
                </span>
              )}
            </div>

            {/* selected users */}
            <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar w-full max-h-[320px]">
              {selectedUsers.map((receiverTab: SearchResultType, index) => (
                <ChatTabButton
                  key={index}
                  isAddUser={true}
                  className="hover:cursor-default hover:bg-[#F3F3F3]"
                  onlineStatus={receiverTab.isOnline}
                  lastMessageOrUserName={receiverTab.username}
                  avatar={receiverTab.avatar || ''}
                  chatName={receiverTab.name || ''}
                />
              ))}
              {selectedUsers.length === 0 && (
                <span className="text-sm text-red-600 text-center mt-2">
                  No users selected. Go back and choose members.
                </span>
              )}
            </div>

            {/* buttons */}
            <div className="flex gap-2 mt-auto">
              <Button
                onClick={handleCreateGroup}
                variant="outline"
                className="flex-1 text-sm hover:cursor-pointer bg-green-500 hover:bg-green-600"
              >
                Create
              </Button>
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 text-sm hover:cursor-pointer"
              >
                Back
              </Button>
              <Button
                onClick={resetGroupCreation}
                variant="outline"
                className="flex-1 text-sm hover:cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export default CreateNewGroup;
