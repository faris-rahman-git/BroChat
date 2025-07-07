import { Button } from "@client/components/ui/button";
import {
    FileText,
    LayoutDashboard,
    LogOut,
    UserPlus,
    Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@client/assets/logo/chatLogo.webp";
import { useAppDispatch } from "@client/hooks/commonHooks/useAppDispatch";
import { useLogout } from "@client/hooks/auth/useLogout";
import { useEffect } from "react";
import { hideLoader, showLoader } from "@client/redux/features/LoaderSlice";
import { logout } from "@client/redux/features/userSlice";

export const UserStatisticsSection = () => {


    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isPending, isSuccess, mutate } = useLogout();

    useEffect(() => {
        if (isPending) {
            dispatch(showLoader());
        } else {
            dispatch(hideLoader());
        }
    }, [isPending]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(logout());
            navigate("/login");
        }
    }, [isSuccess, navigate]);


    // Navigation items data
    const mainNavItems = [
        {
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
            link: "/dashboard",
            active: true,
        },
        { icon: <Users size={20} />, label: "User Management", link: "#" },
        { icon: <FileText size={20} />, label: "Report List", link: "#" },
    ];

    const pageNavItems = [
        { icon: <UserPlus size={20} />, label: "Add New User", link: "#" },
    ];

    return (
        <aside className="w-[238px] h-full border-r border-[#d9d9d9] flex flex-col">
            {/* Logo section */}
            <div className="h-[105px] w-full border-b border-[#d9d9d9] flex items-center justify-center">
                <img src={logo} alt="Brochat Logo" className="max-w-[50%] h-auto" />
            </div>

            {/* Main navigation */}
            <nav className="flex flex-col w-full py-2.5 border-b border-[#d9d9d9]">
                {mainNavItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.link}
                        className={`flex items-center h-[50px] px-4 ${item.active
                                ? "bg-blue-500 text-white"
                                : "text-[#202224] hover:bg-gray-100"
                            }`}
                    >
                        <span className="w-10 flex justify-center">{item.icon}</span>
                        <span className="ml-[18px] font-semibold text-sm tracking-[0.30px]">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </nav>

            {/* Pages section */}
            <div className="flex flex-col w-full py-2.5 border-b border-[#d9d9d9]">
                <div className="px-4 mb-2.5 text-center">
                    <span className="font-bold text-xs text-[#202224] opacity-60 tracking-[0.26px]">
                        PAGES
                    </span>
                </div>

                {pageNavItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.link}
                        className="flex items-center h-[46.3px] px-4 text-[#202224] hover:bg-gray-100"
                    >
                        <span className="w-10 flex justify-center">{item.icon}</span>
                        <span className="ml-[18px] font-semibold text-sm tracking-[0.30px]">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Logout section */}
            <div className="mt-auto">
                <Button
                    variant="ghost"
                    className="flex items-center w-full h-[74px] px-4 justify-start text-[#202224]"
                    onClick={() => mutate()}
                >
                    <span className="w-10 flex justify-center">
                        <LogOut size={20} />
                    </span>
                    <span className="ml-[18px] font-semibold text-sm tracking-[0.30px]">
                        Logout
                    </span>
                </Button>
            </div>
        </aside>
    );
};

export default UserStatisticsSection;