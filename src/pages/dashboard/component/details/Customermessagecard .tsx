import React from "react";
import { Card } from "./Card";

interface CustomerMessageCardProps {
  message: string;
}

export const CustomerMessageCard: React.FC<CustomerMessageCardProps> = ({
  message,
}) => (
  <Card title="Customer Message">
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-700 italic">
      "{message}"
    </div>
  </Card>
);
