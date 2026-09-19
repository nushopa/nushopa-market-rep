import { api } from "./httpClient";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

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
export interface ConfirmDeliveryData {
  orderID: string;
  status: string;
}

export const fetchDistributorAssignedOrders = async (distributorId: string) => {
  const res = await api.get<ApiResponse<AssignedOrdersListData>>(
    `/marketrep/distributor-assigned/${distributorId}`,
  );
  return res.data;
};

export const fetchAssignedOrders = async (distributorId: string) => {
  const res = await api.get<ApiResponse<AssignedOrdersData>>(
    `/marketrep/assigned-orders/${distributorId}`,
  );
  return res.data;
};

export const fetchTotalConfirmedOrders = async (distributorId: string) => {
  const res = await api.get<ApiResponse<ConfirmedOrdersData>>(
    `/marketrep/confirmed-orders/${distributorId}`,
  );
  return res.data;
};

export const fetchTotalPendingOrders = async (distributorId: string) => {
  const res = await api.get<ApiResponse<PendingOrdersData>>(
    `/marketrep/pending-orders/${distributorId}`,
  );
  return res.data;
};

export const fetchTotalCommission = async (distributorId: string) => {
  const res = await api.get<ApiResponse<CommissionData>>(
    `/marketrep/total-commission/${distributorId}`,
  );
  return res.data;
};

export const confirmDeliveryCode = async (
  orderID: string,
  delivery_code: string,
) => {
  const res = await api.post<ApiResponse<ConfirmDeliveryData>>(
    "/order/confirm-delivery",
    { orderID, delivery_code },
  );
  return res.data;
};