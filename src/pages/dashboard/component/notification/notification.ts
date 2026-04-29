export interface Notification {
  id: string;
  _id?: string;       
  title: string;
  message: string;
  time: string;       
  read: boolean;
  type?: "info" | "success" | "warning" | "error";
  category?: string;
  orderId?: string;
  full_name?: string;
  customer_id?: string;
  createdAt?: string;
}

export interface RawNotification {
  _id: string;
  title?: string;
  message?: string;
  createdAt?: string;
  isRead: boolean;
  category?: string;
  orderId?: string;
  full_name?: string;
  customer_id?: string;
  recipient?: string;   
  metadata?: {
    orderId?: string;
    driverId?: string;
    amount?: number;
    [key: string]: unknown;
  };
}