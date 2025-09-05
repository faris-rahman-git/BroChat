import { cn } from '@client/lib/utils';
import React from 'react';
import RenderReplyContent from '../../common/RenderReplyContent';
import { LuClock, LuForward, LuX } from 'react-icons/lu';
import { Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { MdDone, MdDoneAll } from 'react-icons/md';
import {
  ContentType,
  MessageStatusType,
  ReactionsType,
  ReplyToType,
} from '@bro/shared';
import { UserReduxType } from '@client/types/ReduxTypes';
import { useContextMenuComponentHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatPanel/element/ChatPanelMiddle/MessageBubble/useContextMenuComponentHook';

function ContextMenuComponent({
  messageId,
  conversationId,
  message,
  reactions,
  userDetails,
  onScrollToMessage,
  replyTo,
  status,
  isMine,
  isGroup,
  showAvatar,
  senderName,
  isForward,
  MessageType,
  mediaUrl,
  isEdited,
  time,
}: {
  messageId: string;
  conversationId: string;
  message: string;
  reactions: ReactionsType[];
  userDetails: UserReduxType;
  onScrollToMessage?: (messageId: string) => void;
  replyTo?: ReplyToType;
  status: MessageStatusType;
  isMine: boolean;
  isGroup?: boolean;
  showAvatar: boolean;
  senderName?: string;
  isForward?: boolean;
  MessageType: ContentType;
  mediaUrl?: string | null;
  isEdited?: boolean;
  time: string;
}) {
  const {
    isNarrow,
    messageRef,
    audioRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    formatTime,
    emojiCounts,
    sortedReactions,
    showReactionsModal,
    setShowReactionsModal,
    handleRemoveEmoji,
    handleReplyClick,
  } = useContextMenuComponentHook(
    messageId,
    conversationId,
    message,
    reactions,
    userDetails,
    onScrollToMessage,
    replyTo
  );

  const renderStatusIcon = () => {
    if (status === 'sending') return <LuClock className="size-3" />;
    if (status === 'sent') return <MdDone className="size-3" />;
    if (status === 'delivered' || status === 'seen') {
      return (
        <MdDoneAll
          className={cn('size-3', status === 'seen' ? 'text-blue-400' : '')}
        />
      );
    }
    return null;
  };

  return (
    <>
      {senderName && !isMine && isGroup && showAvatar && (
        <div className="mb-1">
          <span
            className={cn(
              'block text-[12px] font-medium leading-tight tracking-wide',
              isMine ? 'text-white/70' : 'text-black/70'
            )}
          >
            {senderName}
          </span>
        </div>
      )}

      {replyTo?.MessageType && (
        <div
          className={cn(
            'mb-2 p-2 rounded border-l-4 cursor-pointer hover:bg-black/5 transition-colors',
            isMine
              ? 'bg-white/10 border-l-white/50'
              : 'bg-gray-50 border-l-[#615EF0]'
          )}
          onClick={handleReplyClick}
        >
          <div
            className={cn(
              'text-xs font-medium mb-1',
              isMine ? 'text-white/80' : 'text-[#615EF0]'
            )}
          >
            {replyTo.senderId === userDetails.id ? 'You' : replyTo.senderName}
          </div>
          <div
            className={cn(
              'text-xs opacity-75',
              isMine ? 'text-white/70' : 'text-gray-600'
            )}
          >
            <RenderReplyContent replyTo={replyTo} />
          </div>
        </div>
      )}

      {isForward && (
        <div className="mb-1">
          <span
            className={cn(
              'flex items-center gap-1 text-[11px] italic font-medium leading-tight tracking-wide',
              isMine ? 'text-white/60' : 'text-black/60'
            )}
          >
            <LuForward className="w-4 h-4" /> Forwarded
          </span>
        </div>
      )}

      {MessageType === 'gif' && (
        <img
          src={mediaUrl || ''}
          alt="GIF"
          className="rounded-[6px] w-[100px] h-auto object-cover"
        />
      )}
      {MessageType === 'text' && (
        <p
          ref={messageRef}
          className={cn(
            'break-all select-text',
            isMine && isNarrow ? 'pe-3' : ''
          )}
        >
          {message}
        </p>
      )}
      {MessageType === 'voice' && mediaUrl && (
        <div className="flex items-center gap-4 p-3 bg-gray-100 rounded-[6px] w-[280px] sm:w-[250px] shadow-md">
          <button
            onClick={() => {
              if (audioRef.current?.paused) {
                audioRef.current.play();
              } else {
                audioRef.current?.pause();
              }
            }}
            className="w-10 h-10 rounded-full bg-[#615EF0] text-white flex items-center justify-center hover:bg-[#4b48d3] transition"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 text-sm text-gray-700">
            {formatTime(isPlaying || currentTime > 0 ? currentTime : duration)}
          </div>

          <audio
            ref={audioRef}
            src={mediaUrl}
            preload="metadata"
            onLoadedMetadata={() => {
              const audio = audioRef.current;
              const checkDuration = () => {
                if (audio?.duration && isFinite(audio.duration)) {
                  setDuration(audio.duration);
                } else {
                  // Retry after short delay (duration might not be ready yet)
                  setTimeout(checkDuration, 100);
                }
              };
              checkDuration();
            }}
            onTimeUpdate={() =>
              setCurrentTime(audioRef.current?.currentTime || 0)
            }
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(0); // Optional reset
            }}
            hidden
          />
        </div>
      )}
      {MessageType === 'image' && (
        <img
          src={mediaUrl || ''}
          alt="Image"
          className="rounded-[6px] max-w-[280px] max-h-[320px] object-contain shadow"
        />
      )}
      {MessageType === 'video' && mediaUrl && (
        <Link
          to={`/video-player?url=${encodeURIComponent(mediaUrl)}`}
          target="_blank"
        >
          <div className="relative max-w-[320px] rounded-[10px] overflow-hidden shadow-lg bg-black cursor-pointer">
            <video
              src={mediaUrl}
              className="w-full h-auto max-h-[320px] rounded-[10px]"
              preload="metadata"
              muted
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm">
              ▶ Tap to play fullscreen
            </div>
          </div>
        </Link>
      )}
      {MessageType === 'document' && mediaUrl && (
        <Link
          to={mediaUrl}
          target="_blank"
          className="relative block w-full max-w-[300px] rounded-[6px] overflow-hidden shadow"
        >
          {mediaUrl.endsWith('.pdf') ? (
            // 📄 Inline PDF preview
            <div className="w-full h-[200px] overflow-hidden">
              <embed
                src={`${mediaUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                type="application/pdf"
                className="w-full h-[250px] pointer-events-none scale-[1.1] -translate-y-[25px]"
              />
              <div className="absolute bottom-0 left-0 w-full px-3 py-2 bg-gradient-to-t from-black/60 to-transparent text-white text-sm text-center">
                📄 Click to open PDF
              </div>
            </div>
          ) : (
            // 📦 Generic file preview card
            <div className="flex flex-col items-center justify-center h-[200px] bg-gray-100 text-gray-700">
              <div className="text-4xl">📦</div>
              <p className="mt-2 text-sm font-medium truncate max-w-[250px]">
                {decodeURIComponent(mediaUrl.split('/').pop() || 'Document')}
              </p>
              <span className="mt-1 text-xs text-gray-500">
                (Click to download)
              </span>
            </div>
          )}
        </Link>
      )}

      <span
        className={cn(
          'absolute bottom-[4px] right-[10px] flex items-center gap-[4px] text-[10px]',
          isMine ? 'text-white/70' : 'text-black/60'
        )}
      >
        <span>{time}</span>
        {isEdited && (
          <span className="italic text-[10px] opacity-70">(edited)</span>
        )}
        {isMine && renderStatusIcon()}
      </span>

      {reactions.length > 0 && (
        <div
          className={cn(
            'absolute -bottom-7 flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm cursor-pointer hover:shadow-md transition-shadow',
            isMine ? 'right-2 ' : 'left-2'
          )}
          onClick={() => setShowReactionsModal(true)}
        >
          {/* Show first 2-3 unique emojis */}
          {emojiCounts.slice(0, 3).map(({ emoji }) => (
            <span key={emoji} className="text-sm">
              {emoji}
            </span>
          ))}
          {/* Show total count */}
          <span className="text-xs text-gray-600 ml-1">{reactions.length}</span>
        </div>
      )}

      {showReactionsModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowReactionsModal(false)}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-sm w-full mx-4 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Reactions</h3>
              <button
                onClick={() => setShowReactionsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {sortedReactions.map((reaction, index) => (
                <div
                  key={`${reaction.userId}-${index}`}
                  className={cn(
                    'flex items-center justify-between p-2 hover:bg-gray-50 rounded',
                    reaction.userId === userDetails.id &&
                      ' text-lg hover:scale-103 transition-transform cursor-pointer'
                  )}
                  onClick={() => {
                    if (reaction.userId === userDetails.id) {
                      handleRemoveEmoji(messageId, conversationId);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-6 rounded-[6px] object-cover">
                      <AvatarImage src={reaction.avatar} alt="avatar" />
                      <AvatarFallback className="text-center bg-[#C9C9C9] text-black text-[10px] rounded-[6px]">
                        {reaction.name.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900">
                      {reaction.name}
                      {reaction.userId === userDetails.id && (
                        <span className="text-xs text-gray-500">(You)</span>
                      )}
                      {reaction.userId === userDetails.id && (
                        <div className="text-xs text-gray-500 ml-1">
                          (Select to remove)
                        </div>
                      )}
                    </span>
                  </div>
                  <span className="text-lg ">{reaction.emoji}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(ContextMenuComponent);
