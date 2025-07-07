import { toggleFullScreen } from '@client/utils/toggleFullScreen';

function SidebarLogo() {
  return (
    <div
      onClick={toggleFullScreen}
      className="relative hover:cursor-pointer transform hover:scale-105 w-12 h-12 bg-app-primary rounded-[6px] overflow-hidden flex items-center justify-center bg-[#615EF0]"
    >
      <span className="[font-family:'Asap-Bold',Helvetica] font-bold text-white text-[21px] text-center tracking-[0] leading-[31.5px]">
        BC
      </span>
    </div>
  );
}

export default SidebarLogo;
