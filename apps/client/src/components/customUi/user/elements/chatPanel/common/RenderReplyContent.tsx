import { ReplyToType } from '@bro/shared';

function RenderReplyContent({ replyTo }: { replyTo: ReplyToType }) {
  switch (replyTo.MessageType) {
    case 'image':
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs">📷 Photo</span>
          {replyTo.mediaUrl && (
            <img
              src={replyTo.mediaUrl || '/placeholder.svg'}
              alt="Reply preview"
              className="w-8 h-8 rounded object-cover"
            />
          )}
        </div>
      );
    case 'video':
      return <span className="text-xs">🎥 Video</span>;
    case 'voice':
      return <span className="text-xs">🎤 Voice message</span>;
    case 'document':
      return <span className="text-xs">📄 Document</span>;
    case 'gif':
      return <span className="text-xs">🎬 GIF</span>;
    default:
      return (
        <div className="inline-flex items-center gap-2 max-w-[300px]">
          <span className="text-xs truncate">
            {replyTo.content || 'Message'}
          </span>
        </div>
      );
  }
}

export default RenderReplyContent;
