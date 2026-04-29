import { useEffect, useState, useCallback, useRef } from "react";
import { NotificationContext } from "./NotificationContext";
import {
  fetchNotifications,
  fetchMarketRepNotifications,
  deleteNotificationApi,
} from "../api/notifcationApi";
import type { Notification } from "../pages/dashboard/component/notification/notification";

interface Props {
  children: React.ReactNode;
  distributorId?: string;
}

export default function NotificationProvider({ children, distributorId }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    let cancelled = false;

    const load = async () => {
      try {
        const data = distributorId
          ? await fetchMarketRepNotifications(distributorId)
          : await fetchNotifications();
        if (!cancelled) {
          setNotifications(data);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
        if (!cancelled) {
          setNotifications([]);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      isMounted.current = false;
    };
  }, [distributorId]); 

  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await deleteNotificationApi(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, markNotificationAsRead, deleteNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}