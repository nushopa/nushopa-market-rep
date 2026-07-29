import { useEffect, useRef, useState } from "react";
import { MdSettings, MdLogout } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";

interface AvatarProps {
  onProfile?: () => void;
  onSettings?: () => void;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

const SIZE_STYLES = {
  sm: {
    button: "w-8 h-8",
    text: "text-xs",
  },
  md: {
    button: "w-10 h-10",
    text: "text-sm",
  },
  lg: {
    button: "w-20 h-20",
    text: "text-2xl",
  },
} as const;

export default function UserLayout({
  onSettings,
  size = "md",
  showName = false,
}: AvatarProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { button: buttonSize, text: textSize } = SIZE_STYLES[size];

  const getFullName = (): string => {
    if (user?.name) return user.name;
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) return user.first_name;
    if (user?.email) return user.email;
    return "User";
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getInitials = (): string => {
    if (user?.name) {
      const names = user.name.trim().split(" ");
      return names.length >= 2
        ? (names[0][0] + names[1][0]).toUpperCase()
        : names[0].slice(0, 2).toUpperCase();
    }
    if (user?.first_name && user?.last_name) {
      return (user.first_name[0] + user.last_name[0]).toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "?";
  };

  const handleLogout = async () => {
    try {
      setOpen(false);
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const menuItems = [
    {
      icon: <MdSettings className="h-4 w-4" />,
      label: "Settings",
      onClick: onSettings,
    },
  ];

  const isLarge = size === "lg";

  return (
    <div
      ref={ref}
      className={`flex ${isLarge ? "flex-col" : "flex-row"} items-center gap-2`}
    >
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label="User menu"
          aria-haspopup="true"
          aria-expanded={open}
          className={`${buttonSize} bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
        >
          <span className={`text-white font-semibold ${textSize} select-none`}>
            {getInitials()}
          </span>
        </button>

        {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-gray-100 z-50 overflow-hidden animate-[fadeSlideDown_0.15s_ease-out]"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs">
                  {getInitials()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || `${user?.first_name ?? ""} ${user?.last_name ?? ""}` || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            {menuItems.map(({ icon, label, onClick }) => (
              <button
                key={label}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onClick?.();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-100 text-left"
              >
                <span className="text-gray-400">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              role="menuitem"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-100 text-left"
            >
              <MdLogout className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
        )}

        <style>{`
          @keyframes fadeSlideDown {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>

      {showName && (
        <span
          className={`font-medium text-gray-900 truncate max-w-[200px] ${
            isLarge ? "text-base" : "text-sm"
          }`}
        >
          {getFullName()}
        </span>
      )}
    </div>
  );
}