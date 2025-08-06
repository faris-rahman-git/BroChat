import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { Input } from '@client/components/ui/input';
import { FaSearch } from 'react-icons/fa';

function ChatSearch({
  tab,
  onSearchChange,
}: {
  tab: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col items-start gap-2.5 px-6 py-3 self-stretch w-full">
      <div className="flex h-12 items-center gap-2.5 px-4 py-2.5  self-stretch w-full bg-[#f3f3f3] rounded-[6px] overflow-hidden">
        <ButtonIcon
          Icon={FaSearch}
          label="Search"
          className="hover:bg-[#f9f9f9] text-[#0000007b]"
        />
        <Input
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-0 bg-transparent h-auto p-1 shadow-none focus-visible:ring-0 placeholder:opacity-40 placeholder:text-black text-sm"
          placeholder={
            tab === 'DMs'
              ? 'Search Chats'
              : tab === 'Groups'
              ? 'Search Group Chats'
              : 'Search a Call'
          }
        />
      </div>
    </div>
  );
}

export default ChatSearch;
