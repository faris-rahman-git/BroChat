import VideoCard from '../elements/callPanel/VideoCard';
import BottomBar from '../elements/callPanel/BottomBar';
import { useCallPanelHook } from '@client/hooks/PageHooks/user/CallPage/panel/useCallPanelHook';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@client/components/ui/avatar';
import { MicOff } from 'lucide-react';
import { stringToColor } from '@client/utils/stringToColor';

const CallPanel = ({
  roomId,
  currentUserId,
  name,
  userAvatar,
  isVideoCall,
}: {
  roomId: string;
  currentUserId: string;
  name: string;
  userAvatar: string;
  isVideoCall: boolean;
}) => {
  const {
    peers,
    userVideoAudio,
    toggleCameraAudio,
    goToBack,
    userVideoRef,
    microphones,
    cameras,
    speakers,
    selectedMicrophone,
    selectedCamera,
    selectedSpeaker,
    switchMicrophone,
    switchCamera,
    switchSpeaker,
  } = useCallPanelHook(roomId, currentUserId, isVideoCall);

  return (
    <div className="flex w-full max-h-screen flex-row bg-[#080808]">
      <div className="w-full h-screen flex flex-col">
        <div className="relative w-full h-[90%] flex flex-row justify-around flex-wrap items-center p-4 box-border gap-3">
          {/* Other Users */}
          {peers.map((peer, idx, arr) => (
            <VideoCard
              key={peer.peerID}
              peer={peer}
              totalReceivers={arr.length}
              userVideoAudio={userVideoAudio}
            />
          ))}

          {/* Current User */}
          <div
            className={` rounded-[6px] overflow-hidden bg-[#080808] ${
              peers.length == 1
                ? 'absolute bottom-0 right-10 w-[200px] h-auto z-10'
                : peers.length == 0
                ? 'relative w-[90%] h-full flex justify-center'
                : 'relative w-[25%] '
            }`}
          >
            {!userVideoAudio[currentUserId]?.video && (
              <div className="absolute inset-0 size-full z-10">
                {userAvatar && userAvatar !== '' ? (
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
                      peers.length == 1
                        ? 'size-[60px]'
                        : peers.length == 0
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
                      {name.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            )}
            {!userVideoAudio[currentUserId]?.audio && (
              <div className="absolute top-1 right-1 z-10">
                <MicOff
                  className={`text-white  h-auto ${
                    peers.length == 1 ? 'w-4' : peers.length == 0 ? 'w-6' : ''
                  }`}
                />
              </div>
            )}
            <video
              ref={userVideoRef}
              muted
              autoPlay
              playsInline
              className={`object-cover  z-0 ${
                peers.length == 0 ? 'w-full' : 'scale-140'
              }`}
            ></video>

            <span
              className={`absolute bottom-1 left-1 ${
                peers.length == 1 ? 'text-xs' : 'text-lg'
              }`}
            >
              (You)
            </span>
          </div>
        </div>

        <div className="h-[10%]">
          <BottomBar
            goToBack={goToBack}
            toggleCameraAudio={toggleCameraAudio}
            userVideoAudio={userVideoAudio[currentUserId]}
            microphones={microphones}
            cameras={cameras}
            speakers={speakers}
                        selectedMicrophone={selectedMicrophone}
            selectedCamera={selectedCamera}
            selectedSpeaker={selectedSpeaker}
            switchMicrophone={switchMicrophone}
            switchCamera={switchCamera}
            switchSpeaker={switchSpeaker}
          />
        </div>
      </div>
    </div>
  );
};

export default CallPanel;
