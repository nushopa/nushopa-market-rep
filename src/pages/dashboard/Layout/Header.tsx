import { MdMenu } from "react-icons/md";
import UserLayout from "../component/UserLayout";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo.png";
import NotificationDropdown from "../component/notification/NotificationDropdown";
import { useNotifications } from "../../../context/NotificationContext";

interface HeaderProps {
  pageTitle?: string;
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead } = useNotifications();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar"
          >
            <MdMenu className="h-6 w-6" />
          </button>

          <div className="logo-wrap">
            <img src={Logo} alt="logo_sample" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
          />
          <UserLayout
            onProfile={() => navigate("/profile")}
            onSettings={() => navigate("/settings")}
          />
        </div>
      </div>
    </header>
  );
}