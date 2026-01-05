import React, { useEffect, useState, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import io from "socket.io-client";

const NotificationBell = () => {
  const api_url = import.meta.env.VITE_API_URL;
  const app_url = import.meta.env.VITE_APP_URL;
  const socket = io(import.meta.env.VITE_API_URL);

  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notificationRef = useRef();
  const navigate = useNavigate();

  const fetchNotificationDate = async () => {
    try {
      const res = await api.get(
        `${api_url}api/administration/notification/list`
      );

      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    // initial fetch
    fetchNotificationDate();

    socket.on("new-notification", (notification) => {
      console.log("🔔 New notification:", notification);

      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("new-notification");
    };
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle click on notification
  const handleNotificationClick = async (notification) => {

    navigate("/" + notification.web_link);
    await api.post(
      `${api_url}api/administration/notification/updateRead/${notification._id}`
    );

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notification._id ? { ...n, status: "read" } : n
      )
    );
  };

  // Get unread count
  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  return (
    <div className="relative" ref={notificationRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setOpenNotification(!openNotification)}
        className="relative px-3 py-3 cursor-pointer rounded bg-gray-100 dark:bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-300"
      >
        <FiBell size={18} className="text-gray-800 dark:text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold flex items-center justify-center bg-red-600 text-white rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {openNotification && (
        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-600">
            Notifications
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <li
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`flex items-start gap-3 px-3 py-3 cursor-pointer rounded  ${
                    n.status === "unread"
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "bg-transparent opacity-70"
                  } hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300`}
                >
                  {n.icon && (
                    <img src={n.icon} alt="icon" className="w-6 h-6 rounded" />
                  )}
                  <div className="text-gray-800 dark:text-gray-200">
                    {n.message}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
