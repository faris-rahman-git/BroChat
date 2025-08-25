import { useRemoveReactionForm } from '@client/hooks/home/messageHooks/logic/useRemoveReactionForm';
import { useEffect, useRef, useState } from 'react';
import { ReactionsType, ReplyToType } from '@bro/shared';
import { UserReduxType } from '@client/types/ReduxTypes';

export const useContextMenuComponentHook = (
  messageId: string,
  conversationId: string,
  message: string,
  reactions: ReactionsType[],
  userDetails: UserReduxType,
  onScrollToMessage?: (messageId: string) => void,
  replyTo?: ReplyToType
) => {
  const [isNarrow, setIsNarrow] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showReactionsModal, setShowReactionsModal] = useState(false);

  useEffect(() => {
    if (messageRef.current) {
      setIsNarrow(messageRef.current.offsetWidth < 300);
    }
  }, [message]);

  const { removeMutate } = useRemoveReactionForm(
    conversationId,
    messageId,
    userDetails.id as string
  );

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

  const getEmojiCounts = () => {
    const emojiMap = new Map<
      string,
      { count: number; users: ReactionsType[] }
    >();

    reactions.forEach((reaction) => {
      if (emojiMap.has(reaction.emoji)) {
        const existing = emojiMap.get(reaction.emoji)!;
        existing.count++;
        existing.users.push(reaction);
      } else {
        emojiMap.set(reaction.emoji, { count: 1, users: [reaction] });
      }
    });

    return Array.from(emojiMap.entries()).map(([emoji, data]) => ({
      emoji,
      count: data.count,
      users: data.users,
    }));
  };

  const getSortedReactions = () => {
    if (!userDetails.id) return reactions;

    const userReactions = reactions.filter((r) => r.userId === userDetails.id);
    const otherReactions = reactions.filter((r) => r.userId !== userDetails.id);

    return [...userReactions, ...otherReactions];
  };

  const emojiCounts = getEmojiCounts();
  const sortedReactions = getSortedReactions();

  const handleRemoveEmoji = (messageId: string, conversationId: string) => {
    removeMutate({ messageId, conversationId });
    setShowReactionsModal(false);
  };

  const handleReplyClick = () => {
    if (replyTo?._id) {
      onScrollToMessage?.(replyTo._id);
    }
  };

  return{
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
    handleReplyClick
  }
};
