
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge, Bell, ChevronDown, Globe, Menu, Search } from "lucide-react";

export const DashboardSection = () => {
  // User data
  const userData = {
    name: "Faris",
    role: "Admin",
    avatar: "", // Placeholder for the avatar image
  };

  // Language data
  const languageData = {
    current: "English",
    flag: "", // Placeholder for the flag image
  };

  // Notification count
  const notificationCount = 6;

  return (
    <header className="w-full h-[70px] bg-white border-b border-gray-100 shadow-sm">
      <div className="h-full flex items-center justify-between px-8">
        {/* Left section: Menu and Search */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#202224] opacity-90"
          >
            <Menu size={24} />
          </Button>

          <div className="relative w-[390px]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </div>
            <Input
              className="pl-11 h-[38px] bg-[#f5f6fa] border-neutral-300 rounded-[19px]"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Right section: Icons and Profile */}
        <div className="flex items-center gap-6">
          {/* Globe icon */}
          <div className="relative">
            <Globe size={24} className="text-gray-600" />
          </div>

          {/* Notification bell */}
          <div className="relative">
            <Bell size={24} className="text-gray-600" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-white">
              {notificationCount}
            </Badge>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {/* <img
                src={languageData.flag}
                alt="Language flag"
                className="w-10 h-[27px] object-cover"
              /> */}
              <span className="font-semibold text-[#646464] text-sm">
                {languageData.current}
              </span>
            </div>
            <ChevronDown size={10} className="text-gray-500" />
          </div>

          {/* User profile */}
          <div className="flex items-center gap-4">
            {/* <Avatar className="h-11 w-11 text-center">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar> */}
            <div className="flex flex-col">
              <span className="font-bold text-neutral-700 text-sm">
                {userData.name}
              </span>
              <span className="font-semibold text-[#565656] text-xs">
                {userData.role}
              </span>
            </div>
            <ChevronDown size={10} className="text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardSection;