import React from "react";
import type { MappedOrder } from "../types";
import { Card } from "./Card";
import { ItemImage } from "./Itemimage";
import { formatCurrency } from "../../../../utils";

interface OrderedItemsCardProps {
  items: MappedOrder["items"];
}

export const OrderedItemsCard: React.FC<OrderedItemsCardProps> = ({
  items,
}) => {
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <Card title={`Ordered Items (${items.length})`} className="h-fit">
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">
          No items in this order.
        </p>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 border-t border-gray-100">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-4 py-4">
                <ItemImage src={item.image} alt={item.name} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 text-start">
                    {item.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {formatCurrency(item.price * item.qty)}
                  </p>
                  <span className="mt-2 inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    Qty: {item.qty}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-sm text-gray-600">
              Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})
            </span>
            <span className="text-base font-semibold text-gray-900">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </>
      )}
    </Card>
  );
};
