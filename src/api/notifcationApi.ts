// ─────────────────────────────────────────────────────────────────────────────
// src/api/notificationApi.ts
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";
import type {
  Notification,
  RawNotification,
} from "../pages/dashboard/component/notification/notification";

// ─────────────────────────────────────────────────────────────────────────────
// AXIOS INSTANCE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shared Axios instance for all notification API calls.
 * Base URL is read from the VITE_BASE_URL environment variable.
 * The request interceptor automatically attaches the JWT from localStorage.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const categoryToType = (category?: string): Notification["type"] => {
  const map: Record<string, Notification["type"]> = {
    order_assigned: "info",
    driver_nearby: "warning",
    commission_earned: "success",
  };
  return map[category?.toLowerCase() ?? ""] ?? "info";
};

export const transformNotification = (raw: RawNotification): Notification => ({
  id: raw._id,
  _id: raw._id,
  title: raw.title ?? raw.message ?? "New Notification",
  message: raw.message ?? "",
  time: raw.createdAt
    ? new Date(raw.createdAt).toLocaleString()
    : "Just now",
  read: raw.isRead,
  type: categoryToType(raw.category),
  category: raw.category,
  // Resolve orderId from metadata first, fall back to top-level field
  orderId: raw.metadata?.orderId ?? raw.orderId,
  full_name: raw.full_name,
  customer_id: raw.customer_id,
  createdAt: raw.createdAt,
});

export const transformMarketRepNotification = (
  raw: RawNotification
): Notification => transformNotification(raw);

export const fetchNotifications = async (): Promise<Notification[]> => {
  const { data } = await api.get<RawNotification[]>("/notifications");
  return data.map(transformNotification);
};

export const fetchMarketRepNotifications = async (
  distributorId: string
): Promise<Notification[]> => {
  const { data } = await api.get<RawNotification[]>(
    `/notifications/marketrep/${distributorId}`
  );
  return data.map(transformMarketRepNotification);
};

export const markNotificationReadApi = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const deleteNotificationApi = async (id: string): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};