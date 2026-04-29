import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { confirmDeliveryCode } from "../api/distributorApi";
import type { ConfirmDeliveryData, ApiResponse } from "../api/distributorApi";

// ─── Query key factory (centralise all keys here) ───────────────────────────
export const distributorKeys = {
  all: ["distributor"] as const,
  orders: (id: string) => [...distributorKeys.all, "orders", id] as const,
  confirmedOrders: (id: string) =>
    [...distributorKeys.all, "confirmedOrders", id] as const,
  pendingOrders: (id: string) =>
    [...distributorKeys.all, "pendingOrders", id] as const,
};

// ─── Hook arguments ──────────────────────────────────────────────────────────
interface UseConfirmDeliveryOptions {
  distributorId: string;
  onSuccess?: (data: ApiResponse<ConfirmDeliveryData>) => void;
  onError?: (message: string) => void;
}

export function useConfirmDelivery({
  distributorId,
  onSuccess,
  onError,
}: UseConfirmDeliveryOptions) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ConfirmDeliveryData>,
    Error,
    { orderID: string; delivery_code: string }>
    ({
    mutationFn: ({ orderID, delivery_code }) =>
      confirmDeliveryCode(orderID, delivery_code),

    onSuccess: (data) => {
      // Refresh all affected query caches in parallel
      queryClient.invalidateQueries({
        queryKey: distributorKeys.orders(distributorId),
      });
      queryClient.invalidateQueries({
        queryKey: distributorKeys.confirmedOrders(distributorId),
      });
      queryClient.invalidateQueries({
        queryKey: distributorKeys.pendingOrders(distributorId),
      });

      queryClient.invalidateQueries({ queryKey: distributorKeys.all });
      
      onSuccess?.(data);
    },

    onError: (err: Error) => {
      let message = "Failed to confirm delivery. Please try again.";

      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data as { message?: string };
        if (typeof data.message === "string") {
          message = data.message;
        }
      }

      onError?.(message);
    },
  });
}