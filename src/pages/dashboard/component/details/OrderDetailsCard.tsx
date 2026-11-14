import React from "react";
import type { MappedOrder } from "../types";
import { Card } from "./Card";

interface OrderDetailsCardProps {
  order: MappedOrder;
}

const Row: React.FC<{ label: string; value: string; breakAll?: boolean }> = ({
  label,
  value,
  breakAll,
}) => (
  <div className="flex justify-between gap-3">
    <p>{label}</p>
    <p className={`text-sm text-gray-500 ${breakAll ? "break-all" : ""}`}>
      {value}
    </p>
  </div>
);

export const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({
  order,
}) => (
  <Card title="Order Details">
    <div className="grid gap-3">
      <Row label="Order ID:" value={order.id} breakAll />
      <Row label="Assigned To:" value={order.assignedTo} />
      <Row label="Timestamp:" value={order.timestamp} />
      <Row label="Customer Name:" value={order.customerName} />
      <Row label="Customer Number:" value={order.customerPhone} />
    </div>
  </Card>
);
