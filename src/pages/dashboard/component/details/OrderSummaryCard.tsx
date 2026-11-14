import React from "react";
import type { MappedOrder } from "../types";
import { Card } from "./Card";
import { formatCurrency, getStatusColor } from "../../../../utils";

interface OrderSummaryCardProps {
  order: MappedOrder;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  order,
}) => (
  <Card title="Order Summary">
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
  </Card>
);
