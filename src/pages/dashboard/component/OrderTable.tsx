// OrderTable.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← added
import axios from 'axios';
import { fetchDistributorAssignedOrders, type AssignedOrder } from '../../../api/distributorApi';

const OrderTable = () => {
  const navigate = useNavigate(); // ← added
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<AssignedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const distributorId = localStorage.getItem("userId");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
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
          setOrders(response.data.assignedOrders);
        } else {
          setError(response.message || "Failed to fetch orders.");
        }
      } catch (err: unknown) {
        console.error("Error fetching orders:", err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "An error occurred while fetching orders.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [distributorId]);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'text-blue-700 bg-blue-100';
      case 'processing': return 'text-yellow-700 bg-yellow-100';
      case 'pending': return 'text-purple-700 bg-purple-100';
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'cancelled': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading your assigned orders...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="overflow-x-auto mt-6 border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-gray-500">Serial No.</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-gray-500">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-gray-500">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-gray-500">Assigned To</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-gray-500">Qty</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedOrders.map((order, index) => {
              const orderId = order.orderID || order._id;

              return (
                <tr
                  key={order._id || order.orderID}
                  onClick={() => navigate(`/orders/${orderId}`)} // ← navigate instead of modal
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {order.orderID}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    {formatCurrency(order.amount_paid || 0)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">You</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                    {order.products?.length || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(order.status || 'delivered')}`}>
                      {order.status || 'Delivered'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, orders.length)} of {orders.length} orders
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                    currentPage === page ? 'bg-black text-white' : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderTable;