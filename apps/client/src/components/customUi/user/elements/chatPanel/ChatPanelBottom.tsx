import { useCallback, useEffect, useRef, useState } from 'react';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { Input } from '@client/components/ui/input';
import { LuCheck, LuMic, LuSendHorizontal, LuSmile, LuX } from 'react-icons/lu';
import { MdAttachFile } from 'react-icons/md';
import { getSocket } from '@client/configs/socket';
import { emitWithQueue } from '@client/lib/socket/emitWithQueue';
import EmojiPicker from 'emoji-picker-react';
import useClickOutside from '@client/hooks/commonHooks/useClickOutside';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { clearEditingMessage } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageEditingSlice';
import { editMessage } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { ContentType } from '@bro/shared';
import { useMutation } from '@tanstack/react-query';
import { uploadFileApi } from '@client/services/home/commonServices';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';

const gf = new GiphyFetch('cVuPZEj9jKPkRr80KWePUACYLxyLEM6x');

function ChatPanelBottom({
  onSend,
  receiverId,
}: {
  onSend: ({
    content,
    mediaUrl,
    MessageType,
  }: {
    content?: string;
    mediaUrl?: string;
    MessageType: ContentType;
  }) => void;
  receiverId: string;
}) {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const hasEmittedStopRef = useRef(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const editingMessage = useSelector(
    (state: RootState) => state.editingMessage
  );
  const [activeTab, setActiveTab] = useState<'emoji' | 'sticker'>('emoji');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchGif, setSearchGif] = useState('');
  useEffect(() => {
    if (activeTab !== 'sticker') setSearchTerm('');
  }, [activeTab]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchGif);
    }, 600);

    return () => clearTimeout(handler);
  }, [searchGif]);

  const fetchGifs = useCallback(
    (offset: number) =>
      searchTerm
        ? gf.search(searchTerm || 'trending', { offset, limit: 10 })
        : gf.trending({ offset, limit: 10 }),
    [searchTerm]
  );

  useClickOutside({
    ref: pickerRef,
    onClickOutside: () => {
      setShowPicker(false);
    },
  });

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    if (value.trim() === '') return;

    const socket = getSocket();
    if (!socket) return;

    // emit start-typing only if not already typing
    if (!isTypingRef.current) {
      emitWithQueue({
        event: 'start-typing',
        data: {
          receiverId,
        },
      });
      isTypingRef.current = true;
      hasEmittedStopRef.current = false;
    }

    // clear old timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // reset timeout to emit stop-typing after 2s of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (!hasEmittedStopRef.current) {
        emitWithQueue({
          event: 'stop-typing',
          data: {
            receiverId,
          },
        });
        hasEmittedStopRef.current = true;
      }
      isTypingRef.current = false;
    }, 2000);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  useEffect(() => {
    if (
      editingMessage.conversationId &&
      editingMessage.messageId &&
      editingMessage.message
    ) {
      setMessage(editingMessage.message);
    }
  }, [editingMessage]);

  const handleSend = () => {
    if (message.trim()) {
      if (editingMessage.messageId) {
        if (message.trim() !== editingMessage.message)
          emitWithQueue({
            event: 'edit-message',
            data: {
              messageId: editingMessage.messageId,
              conversationId: editingMessage.conversationId,
              message: message.trim(),
            },
          });
        dispatch(
          editMessage({
            conversationId: editingMessage.conversationId as string,
            messageId: editingMessage.messageId,
            message: message.trim(),
          })
        );
        setMessage('');
        dispatch(clearEditingMessage());
      } else {
        onSend({
          content: message.trim(),
          MessageType: 'text',
        });
        setMessage('');
        const socket = getSocket();
        if (!socket) return;

        // ensure stop-typing is emitted on send
        if (isTypingRef.current && !hasEmittedStopRef.current) {
          emitWithQueue({
            event: 'stop-typing',
            data: {
              receiverId,
            },
          });
          hasEmittedStopRef.current = true;
          isTypingRef.current = false;
        }

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    }
  };

  const handleGifSend = (gifUrl: string) => {
    onSend({
      MessageType: 'gif',
      mediaUrl: gifUrl,
    });
  };

  // recording
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: uploadMutate, isPending: uploadIsPending } = useMutation({
    mutationFn: uploadFileApi,
    onSuccess: (data: { mediaUrl: string; customMessageType: ContentType }) => {
      onSend({
        mediaUrl: data.mediaUrl,
        MessageType: data.customMessageType,
      });
    },
    onError: (err) => {
      console.error('Upload error:', err.message);
    },
  });
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current)
        clearInterval(recordingIntervalRef.current);
    };
  }, []);
  const handleMicClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
            type: 'audio/webm',
          });

          uploadMutate({
            file: audioFile,
            fileType: audioFile.type,
            extension: 'webm',
            customMessageType: 'voice',
          });
        };

        recorder.start();
        setIsRecording(true);
        setRecordingTime(0);
        recordingIntervalRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.error('Mic access denied or error:', err);
      }
    }
  };
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current!);
    }
  };
  useEffect(() => {
    dispatch(uploadIsPending ? showLoader() : hideLoader());
  }, [uploadIsPending]);

  //file atchment
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [fileInputType, setFileInputType] = useState<
    'image/*' | 'video/*' | '*/*' | null
  >(null);
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileSelect = (type: 'image/*' | 'video/*' | '*/*') => {
    setFileInputType(type);
    setShowAttachmentModal(false);
    setTimeout(() => {
      hiddenFileInputRef.current?.click();
    }, 100);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const type: ContentType = file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
        ? 'video'
        : 'document';

      // You can call your upload logic here
      uploadMutate({
        file,
        fileType: file.type,
        extension: file.name.split('.').pop() || '',
        customMessageType: type,
      });

      // Clear input after use
      event.target.value = '';
    }
  };

  return (
    <footer className={'flex items-center gap-6 p-6'}>
      <ButtonIcon
        Icon={MdAttachFile}
        label={'File'}
        iconClassName="size-6"
        className="hover:bg-white"
        onClick={() => setShowAttachmentModal(!showAttachmentModal)}
      />
      {showAttachmentModal && (
        <div className="absolute bottom-[80px] left-6 z-30 bg-white shadow-lg rounded-lg border p-3 w-[200px] space-y-2">
          <button
            onClick={() => handleFileSelect('image/*')}
            className="w-full text-left text-sm hover:bg-gray-100 px-3 py-2 rounded"
          >
            📷 Image
          </button>
          <button
            onClick={() => handleFileSelect('video/*')}
            className="w-full text-left text-sm hover:bg-gray-100 px-3 py-2 rounded"
          >
            🎬 Video
          </button>
          <button
            onClick={() => handleFileSelect('*/*')}
            className="w-full text-left text-sm hover:bg-gray-100 px-3 py-2 rounded"
          >
            📄 Document
          </button>
        </div>
      )}

      {/* <Picker /> */}

      {showPicker && (
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
            >
              Stickers
            </button>
          </div>

          {activeTab === 'emoji' ? (
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar rounded-md">
              <EmojiPicker
                onEmojiClick={(emojiData) => handleEmojiSelect(emojiData.emoji)}
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
                onChange={(e) => setSearchGif(e.target.value)}
                className="mb-3 text-sm px-3 py-2 rounded-md border-gray-300 focus-visible:ring-0 focus-visible:border-[#615EF0]"
                disabled={isRecording}
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
                    handleGifSend(gif.images.original.url);
                  }}
                  noLink={true}
                  hideAttribution={true}
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex-1 relative h-12">
        <ButtonIcon
          Icon={LuSmile}
          label={'Smile'}
          iconClassName="size-5"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 p-0 hover:bg-white"
          onClick={() => setShowPicker(!showPicker)}
        />

        <Input
          value={message}
          onChange={handleTyping}
          className="h-full px-[60px] text-[30px] py-2.5 rounded-[6px] border-2 border-gray-300 focus-visible:ring-0 focus-visible:border-[#615EF0]"
          placeholder="Type a message"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        {isRecording && (
          <div className="absolute left-1/2 bottom-[calc(100%+4px)] transform -translate-x-1/2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-2 shadow">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>Recording... {recordingTime}s</span>
          </div>
        )}

        {editingMessage.messageId && (
          <ButtonIcon
            Icon={LuX}
            label={'Send'}
            iconClassName="size-5"
            className="absolute right-[50px] top-1/2 transform -translate-y-1/2 bg-[#F3F3F3] p-0 hover:bg-white text-[#615EF0] hover:text-[#615EF0]"
            onClick={() => {
              setMessage('');
              dispatch(clearEditingMessage());
            }}
          />
        )}
        {isRecording ? (
          <ButtonIcon
            Icon={LuSendHorizontal}
            label="Send Recording"
            iconClassName="size-5 text-red-600"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 hover:bg-white"
            onClick={stopRecording}
          />
        ) : message.trim() ? (
          <ButtonIcon
            Icon={editingMessage.messageId ? LuCheck : LuSendHorizontal}
            label={'Send'}
            iconClassName="size-5"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 hover:bg-white text-[#615EF0] hover:text-[#615EF0]"
            onClick={handleSend}
          />
        ) : (
          <ButtonIcon
            Icon={LuMic}
            label={'Mic'}
            iconClassName="size-5"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 hover:bg-white"
            onClick={handleMicClick}
          />
        )}
      </div>

      <input
        type="file"
        ref={hiddenFileInputRef}
        accept={fileInputType || '*/*'}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </footer>
  );
}

export default ChatPanelBottom;
