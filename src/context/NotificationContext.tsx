// src/context/NotificationContext.ts  ← .ts not .tsx (no JSX here)
import { createContext, useContext } from "react";
import type { Notification } from "../pages/dashboard/component/notification/notification";

export interface NotificationContextValue {
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used inside <NotificationProvider>"
    );
  }
  return ctx;
}