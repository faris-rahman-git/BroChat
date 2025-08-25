import { LuX } from 'react-icons/lu';
import { ReplyToType } from '@bro/shared';
import RenderReplyContent from './common/RenderReplyContent';

type ReplyInputProps = {
  replyTo: ReplyToType | null;
  onCancelReply: () => void;
  userId: string;
};

const ReplyInput = ({ replyTo, onCancelReply, userId }: ReplyInputProps) => {
  if (!replyTo) return null;

  return (
    <div className="bg-gray-50 border-l-4 border-l-[#615EF0] p-3 flex items-center justify-between">
      <div className="flex-1 ">
        <div className="text-sm font-medium text-[#615EF0] mb-1">
          Replying to {userId === replyTo.senderId ? 'You' : replyTo.senderName}
        </div>
        <RenderReplyContent replyTo={replyTo} />
      </div>
      <button
        onClick={onCancelReply}
        className="ml-3 p-1 hover:bg-gray-200 rounded-full transition-colors"
      >
        <LuX className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export default ReplyInput;
