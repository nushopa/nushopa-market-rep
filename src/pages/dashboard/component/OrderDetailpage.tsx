import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import axios from "axios";
import {
  confirmDeliveryCode,
  fetchDistributorAssignedOrders,
  type AssignedOrder,
} from "../../../api/distributorApi";
import ConfirmCodeModal from "./ConfirmCodeModal";
import { toast } from "react-toastify";
import type { MappedOrder, ProductItem } from "./types";



const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<MappedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null); // ← new

  const distributorId = localStorage.getItem("userId");

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG")}`;

  const mapToMappedOrder = (backendOrder: AssignedOrder): MappedOrder => ({
    id: backendOrder.orderID || backendOrder._id || "",
    assignedTo: "You (Distributor)",
    avatar: "",
    timestamp: new Date(backendOrder.createdAt).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: (backendOrder.status || "Delivered").toLowerCase(),
    amount: backendOrder.amount_paid || 0,
    customerContact: backendOrder.customer_id
      ? `${backendOrder.customer_id.first_name || ""} ${backendOrder.customer_id.last_name || ""}`.trim() ||
        "N/A"
      : "N/A",
    itemQty: backendOrder.products?.length || 0,
    chat: "Order assigned successfully",
    items: (backendOrder.products || []).map((p: ProductItem) => ({
      name: p.product_id?.product_name || "Unknown Product",
      qty: p.product_quantity || 1,
      price: p.product_id?.product_price || 0,
      image:
        p.product_id?.product_image ||
        "",
    })),
  });

  useEffect(() => {
    const fetchOrder = async () => {
      if (!distributorId) {
        setError("Distributor ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetchDistributorAssignedOrders(distributorId);
        if (response.success && response.data?.assignedOrders) {
          const found = response.data.assignedOrders.find(
            (o: AssignedOrder) => o.orderID === id || o._id === id,
          );
          if (found) {
            setOrder(mapToMappedOrder(found));
          } else {
            setError("Order not found.");
          }
        } else {
          setError(response.message || "Failed to fetch order.");
        }
      } catch (err: unknown) {
        console.error("Error fetching order:", err);
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "An error occurred while fetching the order.",
          );
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [distributorId, id]);

  const handleConfirmCode = async (code: string) => {
    setIsConfirming(true);
    setModalError(null); 
    try {
      const response = await confirmDeliveryCode(order!.id, code);
      if (response.success) {
        toast.success("Delivery code confirmed successfully!");
        setIsModalOpen(false);
        setModalError(null);
      }
    } catch (err: unknown) {
      console.error("Failed to confirm code:", err);
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to confirm delivery code."
        : "An unexpected error occurred.";
      toast.error(errorMessage);
      setModalError(errorMessage); 
    } finally {
      setIsConfirming(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalError(null); 
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-green-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label="Go back"
          >
            <MdOutlineKeyboardArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Confirm Code
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Order Details
              </h3>
              <div className="grid gap-3">
                <div className="flex justify-between gap-3">
                  <p>Order ID:</p>
                  <p className="text-sm text-gray-500">{order.id}</p>
                </div>
                <div className="flex justify-between gap-3">
                  <p>Assigned To:</p>
                  <p className="text-sm text-gray-500">{order.assignedTo}</p>
                </div>
                <div className="flex justify-between gap-3">
                  <p>Timestamp:</p>
                  <p className="text-sm text-gray-500">{order.timestamp}</p>
                </div>
                <div className="flex justify-between gap-3">
                  <p>Customer Name:</p>
                  <p className="text-sm text-gray-500">
                    {order.customerContact}
                  </p>
                </div>
                <div className="flex justify-between gap-3">
                  <p>Customer Number:</p>
                  <p className="text-sm text-gray-500">
                    {order.customerContact}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Order Summary
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(order.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium">{order.itemQty} items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Message */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Customer Message
              </h3>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-700 italic">
                "{order.chat}"
              </div>
            </div>
          </div>

          {/* Right Column — Ordered Items */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm h-fit">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Ordered Items
            </h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-2">
                      {item.name}
                    </p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-500">
                        Qty:{" "}
                        <span className="font-medium text-gray-700">
                          {item.qty}
                        </span>
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Code Modal */}
      <ConfirmCodeModal
        key={isModalOpen ? "open" : "closed"} 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleConfirmCode}
        isLoading={isConfirming}
        externalError={modalError} 
      />
    </>
  );
};

export default OrderDetailPage;