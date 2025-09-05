import React from 'react';
import { Camera, Mic, MicOff, PhoneOff, CameraOff } from 'lucide-react';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';

interface BottomBarProps {
  goToBack: (e: React.MouseEvent) => void;
  toggleCameraAudio: (e: React.MouseEvent) => void;
  userVideoAudio: { video: boolean; audio: boolean };
}

const BottomBar: React.FC<BottomBarProps> = ({
  goToBack,
  toggleCameraAudio,
  userVideoAudio,
}) => {
  return (
    <div className="w-full h-full box-border flex items-center justify-center gap-4 py-3 px-6">
      <ButtonIcon
        onClick={toggleCameraAudio}
        className="p-3 size-11 rounded-[6px] bg-gray-800 text-white hover:bg-gray-700 transition"
        Icon={userVideoAudio.audio ? Mic : MicOff}
        label="Mic"
        data-switch="audio"
      />

      <ButtonIcon
        onClick={toggleCameraAudio}
        className="p-3 size-11 rounded-[6px] bg-gray-800 text-white hover:bg-gray-700 transition"
        Icon={userVideoAudio.video ? Camera : CameraOff}
        label="video"
        data-switch="video"
      />

      <ButtonIcon
        onClick={goToBack}
        className="p-3 size-11 rounded-[6px] bg-red-600 text-white hhover:bg-red-500 transition"
        Icon={PhoneOff}
        label="video"
      />
    </div>
  );
};

export default BottomBar;
