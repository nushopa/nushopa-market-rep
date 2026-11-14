import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) =>
  `₦${amount.toLocaleString("en-NG")}`;

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-blue-100 text-blue-700";
    case "processing":
      return "bg-yellow-100 text-yellow-700";
    case "pending":
      return "bg-purple-100 text-purple-700";
    case "ready for pickup":
      return "bg-indigo-100 text-indigo-700";
    case "shipped":
      return "bg-sky-100 text-sky-700";
    case "delivered":
    case "confirmed":
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
