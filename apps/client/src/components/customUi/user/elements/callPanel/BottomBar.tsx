import React from 'react';
import {
  Camera,
  Mic,
  MicOff,
  PhoneOff,
  CameraOff,
  ChevronUp,
  Headphones,
} from 'lucide-react';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@client/components/ui/dropdown-menu';

interface BottomBarProps {
  goToBack: (e: React.MouseEvent) => void;
  toggleCameraAudio: (e: React.MouseEvent) => void;
  userVideoAudio: { video: boolean; audio: boolean };
  microphones: MediaDeviceInfo[];
  cameras: MediaDeviceInfo[];
  speakers: MediaDeviceInfo[];
  selectedMicrophone: string;
  selectedCamera: string;
  selectedSpeaker: string;
  switchMicrophone: (deviceId: string) => void;
  switchCamera: (deviceId: string) => void;
  switchSpeaker: (deviceId: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  goToBack,
  toggleCameraAudio,
  userVideoAudio,
  microphones,
  cameras,
  speakers,
  selectedMicrophone,
  selectedCamera,
  selectedSpeaker,
  switchMicrophone,
  switchCamera,
  switchSpeaker,
}) => {
  return (
    <div className="w-full h-full box-border flex items-center justify-center gap-4 py-3 px-6">
      <div className="flex items-center">
        <ButtonIcon
          onClick={toggleCameraAudio}
          className="p-3 size-11 rounded-r-[0px] bg-gray-800 text-white hover:bg-gray-700 transition"
          Icon={userVideoAudio.audio ? Mic : MicOff}
          label="Mic"
          data-switch="audio"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-3 h-11 w-10 flex items-center justify-center rounded-r-[6px] bg-gray-800 text-white hover:bg-gray-700 transition border-l border-gray-600">
              <ChevronUp className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="top" className="w-64">
            {microphones.map((mic) => (
              <DropdownMenuItem
                key={mic.deviceId}
                onClick={() => switchMicrophone(mic.deviceId)}
                className={`cursor-pointer ${
                  selectedMicrophone === mic.deviceId
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : ''
                }`}
              >
                <Mic className="mr-2 h-4 w-4" />
                <span className="truncate">
                  {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`}
                </span>
                {selectedMicrophone === mic.deviceId && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center">
        <ButtonIcon
          onClick={toggleCameraAudio}
          className="p-3 size-11 rounded-r-[0px]  bg-gray-800 text-white hover:bg-gray-700 transition"
          Icon={userVideoAudio.video ? Camera : CameraOff}
          label="video"
          data-switch="video"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-3 h-11 w-10 flex items-center justify-center rounded-r-[6px] bg-gray-800 text-white hover:bg-gray-700 transition border-l border-gray-600">
              <ChevronUp className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="top" className="w-64">
            {cameras.map((camera) => (
              <DropdownMenuItem
                key={camera.deviceId}
                onClick={() => switchCamera(camera.deviceId)}
                className={`cursor-pointer ${
                  selectedCamera === camera.deviceId
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : ''
                }`}
              >
                <Camera className="mr-2 h-4 w-4" />
                <span className="truncate">
                  {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                </span>
                {selectedCamera === camera.deviceId && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ButtonIcon
            className="p-3 size-11 rounded-[6px] bg-gray-800 text-white hover:bg-gray-700 transition"
            Icon={Headphones}
            label="Speaker"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="top" className="w-64">
          {speakers.map((speaker) => (
            <DropdownMenuItem
              key={speaker.deviceId}
              onClick={() => switchSpeaker(speaker.deviceId)}
              className={`cursor-pointer ${
                selectedSpeaker === speaker.deviceId
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : ''
              }`}
            >
              <Headphones className="mr-2 h-4 w-4" />
              <span className="truncate">
                {speaker.label || `Speaker ${speaker.deviceId.slice(0, 8)}`}
              </span>
              {selectedSpeaker === speaker.deviceId && (
                <span className="ml-auto text-blue-600">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ButtonIcon
        onClick={goToBack}
        className="p-3 size-11 rounded-[6px] bg-red-600 text-white hover:bg-red-500 transition"
        Icon={PhoneOff}
        label="End call"
      />
    </div>
  );
};

export default BottomBar;
