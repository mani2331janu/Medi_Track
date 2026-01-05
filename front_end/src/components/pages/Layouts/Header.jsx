import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu as MenuIcon, Sun, Moon } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { notifySuccess } from '../../../utils/notify';
import NotificationBell from "./NotificationBell";

const Header = ({ sidebarWidth = 250, onToggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClick = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    notifySuccess("Logout successfully!");
  };

  const handleProfile = () => navigate("/profile");

  return (
    <header
      style={{ left: sidebarWidth }}
      className="fixed top-0 right-0 h-16 bg-white dark:bg-gray-900 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300"
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MenuIcon size={20} color={theme == "dark" ? "#e5e7eb" : "#1f2937"} />
        </button>
        <span className="text-xl font-bold text-gray-800 dark:text-gray-200 transition-colors duration-300">
          Medi Track
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-3 cursor-pointer rounded  bg-gray-100 dark:bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-500  transition-colors duration-300"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <NotificationBell />
        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex cursor-pointer items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray rounded hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-300"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-500 dark:bg-gray-700 dark:text-white flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="hidden sm:inline hover:text-white text-gray-700 dark:text-black transition-colors duration-300 font-bold">
              {user?.name}
            </span>
          </button>


          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li
                  onClick={handleProfile}
                  className="font-bold bg-gray-200 m-2 dark:text-black rounded py-2 hover:bg-gray-300 hover:text-black dark:hover:text-white text-center dark:hover:bg-gray-700 cursor-pointer transition-colors duration-300"
                >
                  Profile
                </li>
                <li
                  onClick={handleLogout}
                  className="font-bold bg-gray-200 m-2 dark:text-black rounded py-2 hover:bg-gray-300 hover:text-black text-center dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer transition-colors duration-300"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
