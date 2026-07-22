import axios, { AxiosError } from "axios";

// ─── Generic API wrapper ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Axios instance ───────────────────────────────────────────────────────────
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

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const is401 = err.response?.status === 401;
    const hasToken = !!localStorage.getItem("token");

    if (is401 && hasToken) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  },
);

export interface OrderProduct {
  product_id: {
    _id: string;
    product_name: string;
    product_brand_name?: string;
    product_price: number;
    product_image?: string;
    product_des?: string;
  };
  product_quantity: number;
}

export interface OrderCustomer {
  _id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

// ─── Domain types ─────────────────────────────────────────────────────────────
export interface AssignedOrder {
  _id: string;
  orderID: string;
  customer_id: OrderCustomer;
  distributor_assigned?: {
    _id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
  products: OrderProduct[];
  address: {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    state: string;
    email?: string;
  };
  amount_paid: number;
  status?: string;
  delivery_code?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AssignedOrdersListData {
  assignedOrders: AssignedOrder[];
  count?: number;
}

export interface AssignedOrdersData {
  totalAssignedOrders: number;
}

export interface ConfirmedOrdersData {
  totalConfirmedOrders: number;
}

export interface PendingOrdersData {
  totalPendingOrders: number;
}

export interface CommissionData {
  totalCommission: number;
}

/** Matches the backend's confirm-delivery response shape */
export interface ConfirmDeliveryData {
  orderID: string;
  status: string;
}

export const fetchDistributorAssignedOrders = async (
  distributorId: string,
): Promise<ApiResponse<AssignedOrdersListData>> => {
  const response = await api.get<ApiResponse<AssignedOrdersListData>>(
    `/marketrep/distributor-assigned/${distributorId}`,
  );
  return response.data;
};

export const fetchAssignedOrders = async (
  distributorId: string,
): Promise<ApiResponse<AssignedOrdersData>> => {
  const response = await api.get<ApiResponse<AssignedOrdersData>>(
    `/marketrep/assigned-orders/${distributorId}`, // ✅ Fixed path
  );
  return response.data;
};

export const fetchTotalConfirmedOrders = async (
  distributorId: string,
): Promise<ApiResponse<ConfirmedOrdersData>> => {
  const response = await api.get<ApiResponse<ConfirmedOrdersData>>(
    `/marketrep/confirmed-orders/${distributorId}`,
  );
  return response.data;
};

export const fetchTotalPendingOrders = async (
  distributorId: string,
): Promise<ApiResponse<PendingOrdersData>> => {
  const response = await api.get<ApiResponse<PendingOrdersData>>(
    `/marketrep/pending-orders/${distributorId}`,
  );
  return response.data;
};

export const fetchTotalCommission = async (
  distributorId: string,
): Promise<ApiResponse<CommissionData>> => {
  const response = await api.get<ApiResponse<CommissionData>>(
    `/marketrep/total-commission/${distributorId}`,
  );
  return response.data;
};

// export const confirmDeliveryCode = async (
//   orderID: string,
//   delivery_code: string,
// ): Promise<ApiResponse<ConfirmDeliveryData>> => {
//   const response = await api.post<ApiResponse<ConfirmDeliveryData>>(
//     `/order/confirm-delivery`,
//     { orderID, delivery_code },
//   );
//   return response.data;
// };

export const confirmDeliveryCode = async (
  orderID: string,
  delivery_code: string,
): Promise<ApiResponse<ConfirmDeliveryData>> => {
  const raw = await api.post(`/order/confirm-delivery`, {
    orderID,
    delivery_code,
  });
  const payload: unknown =
    raw && typeof raw === "object" && "data" in raw
      ? (raw as { data: unknown }).data
      : raw;
  if (
    payload &&
    typeof payload === "object" &&
    "success" in (payload as Record<string, unknown>)
  ) {
    return payload as ApiResponse<ConfirmDeliveryData>;
  }
  return {
    success: true,
    message: "Delivery code confirmed successfully.",
    data: payload as ConfirmDeliveryData,
  };
};