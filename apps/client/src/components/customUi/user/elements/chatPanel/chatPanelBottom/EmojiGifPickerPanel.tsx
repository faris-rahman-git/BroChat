import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Grid } from '@giphy/react-components';
import { Input } from '@client/components/ui/input';
import { GifsResult } from '@giphy/js-fetch-api';

interface EmojiGifPickerPanelProps {
  pickerRef: React.RefObject<HTMLDivElement | null>;
  activeTab: 'emoji' | 'sticker';
  setActiveTab: (tab: 'emoji' | 'sticker') => void;
  onEmojiSelect: (emoji: string) => void;
  onGifSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  searchGifInput: string;
  fetchGifs: (offset: number) => Promise<GifsResult>;
  onGifSend: (gifUrl: string) => void;
  disabled: boolean;
}

const EmojiGifPickerPanel = React.memo(
  ({
    pickerRef,
    activeTab,
    setActiveTab,
    onEmojiSelect,
    onGifSearchChange,
    searchGifInput,
    searchTerm,
    fetchGifs,
    onGifSend,
    disabled,
  }: EmojiGifPickerPanelProps) => {
    return (
      <div
        className="absolute bottom-[80px] left-5 z-20 w-[320px] bg-white rounded-xl shadow-lg p-4 border border-gray-200"
        ref={pickerRef}
      >
        <div className="flex border-b mb-3">
          <button
            className={`flex-1 text-sm py-2 font-medium ${
              activeTab === 'emoji'
                ? 'border-b-2 border-[#615EF0] text-[#615EF0]'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('emoji')}
            disabled={disabled}
          >
            Emoji
          </button>
          <button
            className={`flex-1 text-sm py-2 font-medium ${
              activeTab === 'sticker'
                ? 'border-b-2 border-[#615EF0] text-[#615EF0]'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('sticker')}
            disabled={disabled}
          >
            Stickers
          </button>
        </div>

        {activeTab === 'emoji' ? (
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar rounded-md">
            <EmojiPicker
              onEmojiClick={(emojiData) => onEmojiSelect(emojiData.emoji)}
              previewConfig={{ showPreview: false }}
              skinTonesDisabled={true}
              height={300}
              width="100%"
              lazyLoadEmojis={true}
            />
          </div>
        ) : (
          <>
            <Input
              placeholder="Search stickers"
              value={searchGifInput}
              onChange={onGifSearchChange}
              className="mb-3 text-sm px-3 py-2 rounded-md border-gray-300 focus-visible:ring-0 focus-visible:border-[#615EF0]"
              disabled={disabled}
            />
            <div className="overflow-y-auto max-h-[300px] custom-scrollbar rounded-md">
              <Grid
                key={searchTerm} 
                width={280}
                columns={3}
                gutter={6}
                fetchGifs={fetchGifs}
                onGifClick={(gif, e) => {
                  e.preventDefault();
                  onGifSend(gif.images.original.url);
                }}
                noLink={true}
                hideAttribution={true}
              />
            </div>
          </>
        )}
      </div>
    );
  }
);

export default EmojiGifPickerPanel;
