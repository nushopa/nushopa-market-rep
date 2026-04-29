// src/pages/dashboard/component/notification/NotificationDetailsPage.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IoArrowBack,
  IoNotifications,
  IoCheckmarkCircle,
  IoWarning,
  IoInformationCircle,
  IoAlertCircle,
} from "react-icons/io5";
import type { Notification } from "./notification";

const typeConfig = {
  info: {
    icon: IoInformationCircle,
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconColor: "text-blue-500",
    badge: "bg-blue-100 text-blue-700",
    label: "Info",
  },
  success: {
    icon: IoCheckmarkCircle,
    bg: "bg-green-50",
    border: "border-green-200",
    iconColor: "text-green-500",
    badge: "bg-green-100 text-green-700",
    label: "Success",
  },
  warning: {
    icon: IoWarning,
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-500",
    badge: "bg-amber-100 text-amber-700",
    label: "Warning",
  },
  error: {
    icon: IoAlertCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    iconColor: "text-red-500",
    badge: "bg-red-100 text-red-700",
    label: "Error",
  },
};

interface NotificationDetailsPageProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NotificationDetailsPage({
  notifications = [],
  onMarkAsRead,
  onDelete,
}: NotificationDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [markedRead, setMarkedRead] = useState(false);
  const [deleted, setDeleted] = useState(false);

  // Derive directly at render time — no useEffect+setState needed for lookup
  const found = id ? (notifications.find((n) => n.id === id) ?? null) : null;

  // Merge local read flag so UI updates immediately without waiting for
  // the parent to propagate the updated list back down
  const notification: Notification | null = found
    ? { ...found, read: found.read || markedRead }
    : null;

  // Auto-mark as read once when a valid unread notification first mounts
  const autoMarkFired = useRef(false);
  useEffect(() => {
    if (found && !found.read && onMarkAsRead && !autoMarkFired.current) {
      autoMarkFired.current = true;
      onMarkAsRead(found.id);
      setMarkedRead(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found?.id]);

  const handleMarkAsRead = () => {
    if (!notification) return;
    onMarkAsRead?.(notification.id);
    setMarkedRead(true);
  };

  const handleDelete = () => {
    if (!notification) return;
    onDelete?.(notification.id);
    setDeleted(true);
    setTimeout(() => navigate(-1), 1200);
  };

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!found) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 flex flex-col items-center gap-4 max-w-sm w-full text-center">
          <div className="bg-gray-100 p-4 rounded-full">
            <IoNotifications className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Notification not found
          </h2>
          <p className="text-sm text-gray-500">
            This notification may have been deleted or doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Deleted confirmation ──────────────────────────────────────────────────
  if (deleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 flex flex-col items-center gap-4 max-w-sm w-full text-center">
          <div className="bg-green-100 p-4 rounded-full">
            <IoCheckmarkCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Notification deleted
          </h2>
          <p className="text-sm text-gray-500">Redirecting you back…</p>
        </div>
      </div>
    );
  }

  const config = typeConfig[notification!.type ?? "info"];
  const TypeIcon = config.icon;

  // ── Main detail view ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
        >
          <IoArrowBack className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Card */}
        <div
          className={`bg-white rounded-2xl shadow-sm border ${config.border} overflow-hidden`}
        >
          {/* Coloured header strip */}
          <div
            className={`${config.bg} px-6 py-5 border-b ${config.border} flex items-start gap-4`}
          >
            <div
              className={`p-2.5 rounded-xl bg-white shadow-sm border ${config.border} flex-shrink-0`}
            >
              <TypeIcon className={`h-6 w-6 ${config.iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-semibold text-gray-900 leading-snug">
                  {notification!.title}
                </h1>
                {!notification!.read && (
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Unread
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}
                >
                  {config.label}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{notification!.time}</p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {notification!.message}
            </p>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {!notification!.read ? (
                <button
                  onClick={handleMarkAsRead}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <IoCheckmarkCircle className="h-4 w-4" />
                  Mark as read
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <IoCheckmarkCircle className="h-4 w-4 text-green-500" />
                  Read
                </span>
              )}
            </div>

            <button
              onClick={handleDelete}
              className="text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Delete notification
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 mt-4">
          ID: {notification!.id}
        </p>
      </div>
    </div>
  );
}