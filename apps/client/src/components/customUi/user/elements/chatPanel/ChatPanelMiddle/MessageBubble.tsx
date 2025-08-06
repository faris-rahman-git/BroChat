import { cn } from '@client/lib/utils';
import {
  LuClock,
  LuCopy,
  LuForward,
  LuInfo,
  LuPin,
  LuReply,
  LuTrash,
  LuTrash2,
} from 'react-icons/lu';
import {
  MdDone,
  MdDoneAll,
  MdOutlineBackspace,
  MdOutlineCheckBox,
  MdOutlineEdit,
} from 'react-icons/md';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@client/components/ui/avatar';
import { useEffect, useRef, useState } from 'react';
import { ContentType, DeleteMessageType, MessageStatusType } from '@bro/shared';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@client/components/ui/context-menu';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import { useDeleteMessage } from '@client/hooks/home/messageHooks/useDeleteMessage';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { deleteMessage } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import { setEditingMessage } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageEditingSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMinutesSince } from '@bro/shared';

type Props = {
  messageId: string;
  conversationId: string;
  isMine: boolean;
  message: string;
  time: string;
  status?: MessageStatusType;
  avatarUrl?: string;
  showAvatar?: boolean;
  senderName?: string;
  isEdited?: boolean;
  isGroup?: boolean;
  isAdmin?: boolean;
  MessageType?: ContentType;
  mediaUrl?: string | null;
  createdAt?: string | Date;
};

const MessageBubble = ({
  messageId,
  conversationId,
  isMine,
  message,
  time,
  status = 'sent',
  showAvatar = true,
  avatarUrl,
  senderName = '',
  isEdited,
  isGroup,
  isAdmin,
  MessageType,
  mediaUrl,
  createdAt = new Date(),
}: Props) => {
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const [menuKey, setMenuKey] = useState(0);
  const dispatch = useAppDispatch();
  const { mutate, isSuccess } = useDeleteMessage();
  const editingMessage = useSelector(
    (state: RootState) => state.editingMessage
  );
  const userDetails = useSelector((state: RootState) => state.user);
  const canEdit = userDetails.isSubscribed || getMinutesSince(createdAt) <= 5;
  const canDeleteForEveryone =
    (userDetails.isSubscribed || getMinutesSince(createdAt) <= 60) &&
    (isMine || isAdmin);

  const isBeingEdited = editingMessage?.messageId === messageId;

  useEffect(() => {
    if (messageRef.current) {
      setIsNarrow(messageRef.current.offsetWidth < 300);
    }
  }, [message]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(deleteMessage({ conversationId, messageId }));
    }
  }, [isSuccess]);

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

  const handleDelete = (type: DeleteMessageType) => {
    mutate({ messageId, conversationId, type });
    setMenuKey((prev) => prev + 1);
  };

  // audio
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return '00:00';

    const mins = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');

    return `${mins}:${secs}`;
  };

  return (
    <div
      className={cn(
        'flex w-full gap-2',
        isMine ? 'justify-end' : 'justify-start',
        isBeingEdited &&
          'ring-2 ring-[#615EF0] rounded-b-[6px] rounded-tl-[6px]'
      )}
    >
      {!isMine && (
        <div className="min-w-6 h-6">
          {showAvatar && (
            <Avatar className="size-6 self-end rounded-[6px]">
              <AvatarImage src={avatarUrl} alt="avatar" />
              <AvatarFallback className="text-center bg-white rounded-[6px]">
                {senderName.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <ContextMenu key={menuKey}>
        <ContextMenuTrigger
          className={cn(
            'relative max-w-[65%] min-w-[125px] rounded-[6px] px-4 pt-2 pb-5 text-sm whitespace-pre-wrap break-words',
            isMine
              ? 'bg-[#615EF0] text-white rounded-tr-none'
              : 'bg-white text-black rounded-tl-none',
            isEdited ? 'min-w-[125px]' : 'min-w-[100px]'
          )}
        >
          {senderName && !isMine && isGroup && showAvatar && (
            <div className="mb-1">
              <span
                className={cn(
                  'block text-[11px] font-medium leading-tight tracking-wide',
                  isMine ? 'text-white/70' : 'text-black/70'
                )}
              >
                {senderName}
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
                {formatTime(
                  isPlaying || currentTime > 0 ? currentTime : duration
                )}
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

          {MessageType === 'document' && mediaUrl?.endsWith('.pdf') && (
            <Link
              to={mediaUrl}
              target="_blank"
              className="relative block w-full max-w-[300px] h-[200px] rounded-[6px] overflow-hidden shadow"
            >
              <div className="w-full h-full overflow-hidden">
                <embed
                  src={`${mediaUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  type="application/pdf"
                  className="w-full h-[400px] pointer-events-none scale-[1.1] -translate-y-[50px]"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full px-3 py-2 bg-gradient-to-t from-black/60 to-transparent text-white text-sm text-center">
                📄 Click to open
              </div>
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
        </ContextMenuTrigger>

        <ContextMenuContent className="w-52">
          <ContextMenuItem inset>
            Back
            <ContextMenuShortcut>
              <MdOutlineBackspace />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset disabled>
            Forward
            <ContextMenuShortcut>
              <LuForward />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset disabled>
            Reply
            <ContextMenuShortcut>
              <LuReply />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset disabled>
            Copy
            <ContextMenuShortcut>
              <LuCopy />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>Delete</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-auto">
              <ContextMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <ConfirmActionButton
                  buttonClassName="transparent text-red-500 hover:text-red-500 w-full h-ful flex justify-start items-center"
                  buttonContent="Delete for me"
                  buttonIcon={LuTrash}
                  modalTitle={`Delete Message`}
                  modalDescription="This have no effect on your recipient chat."
                  confirmButtonContent="Delete for me"
                  onConfirm={() => handleDelete('me')}
                />
              </ContextMenuItem>
              {(isAdmin || isMine) && canDeleteForEveryone && (
                <ContextMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <ConfirmActionButton
                    buttonClassName="transparent text-red-500 hover:text-red-500 w-full h-ful flex justify-start items-center"
                    buttonContent="Delete for everyone"
                    buttonIcon={LuTrash2}
                    modalTitle={`Delete Message`}
                    modalDescription="This have no effect on your recipient chat."
                    confirmButtonContent="Delete For Everyone"
                    onConfirm={() => handleDelete('everyone')}
                  />
                </ContextMenuItem>
              )}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem
            disabled={!isMine || !canEdit}
            inset
            onClick={() =>
              dispatch(
                setEditingMessage({
                  messageId,
                  conversationId,
                  message: message,
                })
              )
            }
          >
            Edit
            <ContextMenuShortcut>
              <MdOutlineEdit />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset disabled>
            Pin
            <ContextMenuShortcut>
              <LuPin />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem inset disabled>
            Select
            <ContextMenuShortcut>
              <MdOutlineCheckBox />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset disabled>
            Info
            <ContextMenuShortcut>
              <LuInfo />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default MessageBubble;
