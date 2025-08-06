import { useState, useRef, useCallback, useEffect } from 'react';
import useClickOutside from '@client/hooks/commonHooks/useClickOutside';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { ContentType } from '@bro/shared';

const gf = new GiphyFetch('cVuPZEj9jKPkRr80KWePUACYLxyLEM6x');

interface MessageSubmitArgs {
  content?: string;
  mediaUrl?: string;
  MessageType: ContentType;
}

export const useEmojiStickerPicker = (
  onSendMessage: (args: MessageSubmitArgs) => void
) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<'emoji' | 'sticker'>('emoji');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchGifInput, setSearchGifInput] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useClickOutside({
    ref: pickerRef,
    onClickOutside: () => setShowPicker(false),
  });

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchTerm(searchGifInput);
    }, 600);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchGifInput]);

  useEffect(() => {
    if (activeTab !== 'sticker') {
      setSearchGifInput('');
      setSearchTerm('');
    }
  }, [activeTab]);

  const fetchGifs = useCallback(
    (offset: number) =>
      searchTerm
        ? gf.search(searchTerm, { offset, limit: 10 })
        : gf.trending({ offset, limit: 10 }),
    [searchTerm]
  );

  const handleEmojiClick = useCallback((emoji: string) => {
    return emoji;
  }, []);

  const handleGifClick = useCallback(
    (gifUrl: string) => {
      onSendMessage({
        MessageType: 'gif',
        mediaUrl: gifUrl, 
      });
      setShowPicker(false);
    },
    [onSendMessage]
  );

  return {
    showPicker,
    setShowPicker,
    pickerRef,
    activeTab,
    setActiveTab,
    searchGifInput,
    setSearchGifInput,
    fetchGifs,
    handleEmojiClick, 
    handleGifClick,
    searchTerm, 
  };
};
