import { Card } from '@client/components/ui/card';
import { RefObject, useEffect, useState } from 'react';
import { Input } from '@client/components/ui/input';
import ChatTab from '../ChatTab';
import { Quantum } from 'ldrs/react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { setActiveReceiver } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import { SearchResultType } from '@bro/shared';
import { useSearchUser } from '@client/hooks/home/dmHooks/useSearchUser';

function AddUserCard({
  newChatRef,
  setActiveTab,
}: {
  newChatRef: RefObject<HTMLDivElement | null>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResultType[]>([]);
  const [searchError, setSearchError] = useState('No User Found');
  const { mutate, isPending, isSuccess, isError, data, error } =
    useSearchUser();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        mutate({ searchData: searchValue });
      }
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [searchValue]);

  useEffect(() => {
    if (isSuccess) {
      setSearchResult(data.MatchedUsers);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setSearchResult([]);
      setSearchError(error.message);
    } else {
      setSearchError('No User Found');
    }
  }, [isError, error]);

  useEffect(() => {
    if (isPending) {
      setSearchResult([]);
    }
  }, [isPending]);

  const handleAddUser = (receiverAndChatDetails: SearchResultType) => {
    dispatch(setActiveReceiver({ receiver: receiverAndChatDetails }));
    setActiveTab('');
  };

  return (
    <Card
      ref={newChatRef}
      className="absolute top-[125%] left-[0] flex flex-col justify-start items-center shadow-md rounded-[6px] bg-[#F3F3F3] w-[300px] h-[500px] z-10"
    >
      <div className="flex flex-col gap-2 w-[90%] h-full">
        <span className="ps-[9px] text-sm font-semibold">New Chat</span>

        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search UserName"
          className="border-0 bg-white rounded-[6px] h-auto p-3 shadow-none focus-visible:ring-0 placeholder:opacity-40 placeholder:text-black text-sm"
        />

        <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar w-full max-h-[400px]">
          {searchValue != '' &&
            searchResult.map((receiverTab: SearchResultType, index) => (
              <ChatTab
                key={index}
                isAddUser={true}
                className="hover:bg-[#ffffff] "
                onClick={() => handleAddUser(receiverTab)}
                onlineStatus={receiverTab.isOnline}
                lastMessageOrUserName={receiverTab.username}
                avatar={receiverTab.avatar || ''}
                chatName={receiverTab.name || ''}
              />
            ))}
          {(searchValue == '' || searchResult.length == 0) && !isPending && (
            <span className="text-sm text-[#0000007b] text-center pt-5">
              {searchError}
            </span>
          )}

          {isPending && (
            <div className="flex items-center justify-center w-full h-[300px]">
              <Quantum size={60} speed={1.75} color="black" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default AddUserCard;
