import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@client/components/ui/avatar';

type Props = {
  avatarUrl?: string;
  showAvatar?: boolean;
};

const TypingBubble = ({ avatarUrl, showAvatar = true }: Props) => {
  return (
    <div className="flex w-full gap-2 justify-start">
      <div className="min-w-6 h-6">
        {showAvatar ? (
          <Avatar className="size-6 self-end">
            <AvatarImage src={avatarUrl} alt="avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-6 opacity-0 pointer-events-none" />
        )}
      </div>

      <div className="relative max-w-[65%] min-w-[80px] h-[40px] flex justify-center items-center rounded-[6px] px-4 py-2 bg-white text-black rounded-tl-none">
        <div className="flex gap-1 items-center h-4">
          <span className="w-2 h-2 bg-black rounded-full animate-bounce" />
          <span
            className="w-2 h-2 bg-black rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 bg-black rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingBubble;
