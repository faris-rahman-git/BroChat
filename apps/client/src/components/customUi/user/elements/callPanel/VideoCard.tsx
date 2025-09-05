import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@client/components/ui/avatar';
import { useVideoCardHook } from '@client/hooks/PageHooks/user/CallPage/panel/callPanel/useVideoCardHook';
import {
  CustomPeerInstance,
  UserVideoAudio,
} from '@client/types/user/CallPanelType';
import { stringToColor } from '@client/utils/stringToColor';
import { MicOff } from 'lucide-react';

const VideoCard = ({
  peer,
  totalReceivers,
  userVideoAudio,
}: {
  peer: CustomPeerInstance;
  totalReceivers: number;
  userVideoAudio: Record<string, UserVideoAudio>;
}) => {
  const { ref, info, userAvatar, name } = useVideoCardHook(
    peer,
    userVideoAudio
  );

  return (
    <div
      className={` rounded-[6px] overflow-hidden bg-[#080808] ${
        totalReceivers == 1
          ? 'relative w-[90%] h-full flex justify-center'
          : 'relative w-[25%]'
      }`}
    >
      {!info?.video && (
        <div className="absolute inset-0 size-full">
          {userAvatar ? (
            <div
              className="absolute inset-0 bg-center bg-cover blur-2xl scale-125"
              style={{ backgroundImage: `url(${userAvatar})` }}
            ></div>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: stringToColor(name),
              }}
            ></div>
          )}

          <div className="absolute inset-0 bg-black/30"></div>

          <div className="relative size-full flex justify-center items-center">
            <Avatar
              className={` bg-[#c9c9c9] rounded-[6px] shadow-lg ${
                totalReceivers == 1
                  ? 'size-[60px]'
                  : totalReceivers == 0
                  ? 'size-[100px]'
                  : ''
              }`}
            >
              <AvatarImage
                src={userAvatar || ''}
                alt={name}
                className="object-cover size-full"
              />
              <AvatarFallback className="text-center text-black font-medium rounded-[6px]">
                {name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      )}
      {!info?.audio && (
        <div className="absolute top-1 right-1">
          <MicOff
            className={`text-white  h-auto ${totalReceivers == 1 ? 'w-6' : ''}`}
          />
        </div>
      )}
      <video
        ref={ref}
        autoPlay
        playsInline
        className={`object-cover ${
          totalReceivers == 1 ? 'w-full' : 'scale-140'
        }`}
      ></video>

      <span className="absolute bottom-1 left-1 text-lg">{name}</span>
    </div>
  );
};

export default VideoCard;
