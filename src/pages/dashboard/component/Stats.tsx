import {
  MdShoppingCart,
  MdIncompleteCircle,
  MdAccessTimeFilled,
} from "react-icons/md";
import { FaCoins } from "react-icons/fa";
import StatsCard from "./StatsCard";
import { useEffect, useState } from "react";
import {
  fetchAssignedOrders,
  fetchTotalCommission,
  fetchTotalConfirmedOrders,
  fetchTotalPendingOrders,
} from "../../../api/distributorApi";

interface StatsData {
  balance: number;
  totalDeliveries: number;
  completed: number;
  pending: number;
}

const Stats = () => {
  const [stats, setStats] = useState<StatsData>({
    balance: 0,
    totalDeliveries: 0,
    completed: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CHANGED: use "userId" key which matches what login stores in localStorage
  const distributorId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAllStats = async () => {
      if (!distributorId) {
        setError("Distributor ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const [assignedRes, confirmedRes, pendingRes, commissionRes] =
          await Promise.allSettled([
            fetchAssignedOrders(distributorId),
            fetchTotalConfirmedOrders(distributorId),
            fetchTotalPendingOrders(distributorId),
            fetchTotalCommission(distributorId),
          ]);

        setStats({
          totalDeliveries:
            assignedRes.status === "fulfilled"
              ? assignedRes.value.data.totalAssignedOrders || 0
              : 0,

          completed:
            confirmedRes.status === "fulfilled"
              ? confirmedRes.value.data.totalConfirmedOrders || 0
              : 0,

          pending:
            pendingRes.status === "fulfilled"
              ? pendingRes.value.data.totalPendingOrders || 0
              : 0,

          balance:
            commissionRes.status === "fulfilled"
              ? commissionRes.value.data.totalCommission || 0
              : 0,
        });

        // ADDED: check if any individual call failed and warn in console
        // without blocking the UI — helps pinpoint the broken endpoint
        const failures = [
          { name: "assignedOrders", result: assignedRes },
          { name: "confirmedOrders", result: confirmedRes },
          { name: "pendingOrders", result: pendingRes },
          { name: "commission", result: commissionRes },
        ].filter((r) => r.result.status === "rejected");

        if (failures.length > 0) {
          failures.forEach((f) => {
            console.warn(
              `⚠️ Failed to fetch ${f.name}:`,
              (f.result as PromiseRejectedResult).reason
            );
          });
        }

      } catch (err) {
        // CHANGED: log the full error object so you can see status code,
        // response body, and which URL failed — not just a generic message
        console.error("Unexpected error fetching stats:", err);
        setError("Failed to load statistics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, [distributorId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <StatsCard
        title="Balance"
        value={`₦${stats.balance.toLocaleString()}`}
        icon={FaCoins}
        cardColor="#EEF2FF"
        iconColor="#5d81f8"
      />
      <StatsCard
        title="Total Deliveries"
        value={stats.totalDeliveries.toLocaleString()}
        icon={MdShoppingCart}
        iconColor="#1680a3"
        cardColor="#1680a325"
      />
      <StatsCard
        title="Completed"
        value={stats.completed.toLocaleString()}
        icon={MdIncompleteCircle}
        iconColor="#16A34A"
        cardColor="#16A34A25"
      />
      <StatsCard
        title="Pending"
        value={stats.pending.toLocaleString()}
        icon={MdAccessTimeFilled}
        iconColor="#a38416"
        cardColor="#a3841625"
      />
    </div>
  );
};

export default Stats;