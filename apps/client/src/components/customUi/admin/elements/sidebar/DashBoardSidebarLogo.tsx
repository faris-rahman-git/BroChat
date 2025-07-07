import { toggleFullScreen } from '@client/utils/toggleFullScreen';
import logo from '@client/assets/logo/chatLogo.webp';

function DashBoardSidebarLogo() {
  return (
    <div
      onClick={toggleFullScreen}
      className="hover:cursor-pointer transform hover:scale-105 w-full h-auto  flex items-center justify-center"
    >
      <div className="h-auto w-[45%]">
        <img
          src={logo}
          alt="BroChat Logo"
          className="h-auto w-auto object-contain"
        />
      </div>
    </div>
  );
}

export default DashBoardSidebarLogo;
