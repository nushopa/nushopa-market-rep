import { api } from "./httpClient";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface OrderProduct {
  product_id:
    | string
    | {
        _id: string;
        product_name?: string;
        product_brand_name?: string;
        product_price?: number;
        product_image?: string | string[];
        product_des?: string;
      }
    | null;
  // snapshot fields saved at payment time
  product_name?: string;
  unit_price?: number;
  // backend spelling (typo) + the correct spelling
  product_quatity?: number;
  product_quantity?: number;
}

export interface OrderCustomer {
  _id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
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
    phone_number?: string;
  };
  amount_paid: number;
  status?: MarketRepOrderStatus;
  delivery_code?: string;
  delivery_fee?: number;
  delivery_mode?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderLineItem {
  id: string;
  name: string;
  brand?: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export type MarketRepOrderStatus =
  "Processing" | "ready for pickup" | "Shipped" | "Delivered";

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

export const normalizeOrderItems = (
  products: OrderProduct[] = [],
): OrderLineItem[] =>
  products.map((item, index) => {
    const p =
      item.product_id && typeof item.product_id === "object"
        ? item.product_id
        : null;
    const quantity = Number(item.product_quatity ?? item.product_quantity) || 1;
    const unitPrice = Number(item.unit_price ?? p?.product_price) || 0;
    const rawImage = p?.product_image;
    return {
      id:
        (p?._id ??
          (typeof item.product_id === "string" ? item.product_id : "")) ||
        String(index),
      name: item.product_name ?? p?.product_name ?? "Unknown Product",
      brand: p?.product_brand_name,
      image: Array.isArray(rawImage) ? rawImage[0] : rawImage,
      unitPrice,
      quantity,
      lineTotal: unitPrice * quantity,
    };
  });

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

export const updateOrderStatusByMarketRep = async (
  orderID: string,
  status: MarketRepOrderStatus,
) => {
  const res = await api.put<ApiResponse<ConfirmDeliveryData>>(
    "/order/update-order-status",
    { orderID, status },
  );
  return res.data;
};
