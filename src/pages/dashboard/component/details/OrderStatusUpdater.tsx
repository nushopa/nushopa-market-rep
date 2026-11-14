import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  updateOrderStatusByMarketRep,
  type MarketRepOrderStatus,
} from "../../../../api/distributorApi";

const FLOW: { value: MarketRepOrderStatus; label: string }[] = [
  { value: "Processing", label: "Processing" },
  { value: "ready for pickup", label: "Ready for pickup" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
];

export function OrderStatusUpdater({
  orderID,
  currentStatus,
  onUpdated,
}: {
  orderID: string;
  currentStatus?: string;
  onUpdated: () => void; // e.g. refetch the order
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close the menu on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const current = (currentStatus ?? "").toLowerCase();
  if (["confirmed", "completed", "delivered"].includes(current)) return null;

  const idx = FLOW.findIndex((s) => s.value.toLowerCase() === current);
  const options = FLOW.slice(idx + 1); // idx -1 (other statuses) => all options
  if (options.length === 0) return null;

  const choose = async (status: MarketRepOrderStatus, label: string) => {
    setOpen(false);
    if (
      !window.confirm(
        `Change status to "${label}"? The customer and admin will be emailed.`,
      )
    )
      return;

    setSaving(true);
    try {
      await updateOrderStatusByMarketRep(orderID, status);
      toast.success(`Order status updated to "${label}".`);
      onUpdated();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? "Could not update status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={saving}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {saving ? "Updating…" : "Update Status"}
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M5.5 7.5 10 12l4.5-4.5-1-1L10 10 6.5 6.5z" />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 min-w-[220px] overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options.map((o) => (
            <li key={o.value} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => choose(o.value, o.label)}
                className="block w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
