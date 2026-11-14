import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import {
  fetchDistributorAssignedOrders,
  normalizeOrderItems,
  type AssignedOrder,
} from "../../../api/distributorApi";
import type { MappedOrder } from "./types";
import { OrderStatusUpdater } from "./details/OrderStatusUpdater";
import { CustomerMessageCard } from "./details/Customermessagecard ";
import { OrderSummaryCard } from "./details/OrderSummaryCard";
import { OrderDetailsCard } from "./details/OrderDetailsCard";
import { OrderedItemsCard } from "./details/OrderEdItemsCard";

const mapToMappedOrder = (o: AssignedOrder): MappedOrder => {
  const items = normalizeOrderItems(o.products).map((i) => ({
    name: i.name,
    qty: i.quantity,
    price: i.unitPrice,
    image: i.image ?? "",
  }));

  const addressName =
    `${o.address?.first_name ?? ""} ${o.address?.last_name ?? ""}`.trim();
  const accountName =
    `${o.customer_id?.first_name ?? ""} ${o.customer_id?.last_name ?? ""}`.trim();

  return {
    id: o.orderID || o._id || "",
    assignedTo: "You (Distributor)",
    timestamp: new Date(o.createdAt).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: (o.status || "Processing").toLowerCase(),
    amount: o.amount_paid || 0,
    customerName: addressName || accountName || "N/A",
    customerPhone:
      o.address?.phone_number || o.customer_id?.phone_number || "N/A",
    itemQty: items.reduce((sum, i) => sum + i.qty, 0),
    chat: "Order assigned successfully",
    items,
  };
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<MappedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(
    async (showSpinner = true) => {
      if (!user) return;
      try {
        if (showSpinner) setLoading(true);
        setError(null);

        const response = await fetchDistributorAssignedOrders(user._id);
        if (response.success && response.data?.assignedOrders) {
          const found = response.data.assignedOrders.find(
            (o: AssignedOrder) => o.orderID === id || o._id === id,
          );
          if (found) setOrder(mapToMappedOrder(found));
          else setError("Order not found.");
        } else {
          setError(response.message || "Failed to fetch order.");
        }
      } catch (err: unknown) {
        console.error("Error fetching order:", err);
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message ||
                "An error occurred while fetching the order."
            : "An unexpected error occurred.",
        );
      } finally {
        setLoading(false);
      }
    },
    [user, id],
  );

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError("You're not signed in. Please log in again.");
      setLoading(false);
      return;
    }
    fetchOrder();
  }, [authLoading, user, fetchOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || "Order not found."}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2 text-sm font-medium bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start gap-3 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="Go back"
        >
          <MdOutlineKeyboardArrowLeft className="w-5 h-5" />
        </button>

        <OrderStatusUpdater
          orderID={order.id}
          currentStatus={order.status}
          onUpdated={() => fetchOrder(false)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <OrderDetailsCard order={order} />
          <OrderSummaryCard order={order} />
          <CustomerMessageCard message={order.chat} />
        </div>

        <OrderedItemsCard items={order.items} />
      </div>
    </div>
  );
};

export default OrderDetailPage;
