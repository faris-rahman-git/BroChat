import { Phone, PhoneOff, Video, Mic } from 'lucide-react';
import { useCallInviteToastHook } from '@client/hooks/PageHooks/common/useCallInviteToastHook';

type CallInviteToastProps = {
  name: string;
  avatar: string;
  isVideoCall: boolean;
  onAccept: () => void;
  onReject: () => void;
};

const CallInviteToast: React.FC<CallInviteToastProps> = ({
  name,
  avatar,
  isVideoCall,
  onAccept,
  onReject,
}) => {
  const { handleAccept, handleReject } = useCallInviteToastHook(
    onAccept,
    onReject
  );

  return (
    <div className="flex items-center w-full gap-4 max-w-sm p-4 bg-white rounded-[6px] shadow-md">
      {/* Avatar */}
      <img
        src={avatar || '/default-avatar.png'}
        alt="Caller Avatar"
        className="w-14 h-14 rounded-[6px] object-cover border-2 border-gray-200"
      />

      {/* Text + Buttons */}
      <div className="flex flex-row flex-1 gap-2 justify-center items-center">
        {/* Name & Call Type */}
        <div>
          <div className="font-semibold text-base mb-1">{name}</div>
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isVideoCall ? 'text-blue-600' : 'text-purple-600'
            }`}
          >
            {isVideoCall ? <Video size={16} /> : <Mic size={16} />}
            {isVideoCall ? 'Video Call' : 'Audio Call'}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleAccept}
            className="bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          >
            <Phone size={18} />
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          >
            <PhoneOff size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallInviteToast;
