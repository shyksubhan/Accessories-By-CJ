import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ordersApi, type ApiOrder } from "@/lib/api";
import { Search, Filter, RefreshCw, ChevronDown, Package, Eye, AlertCircle } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "Pending",   color: "#D97706", bg: "#FEF3C7" },
  confirmed: { label: "Confirmed", color: "#2563EB", bg: "#DBEAFE" },
  shipped:   { label: "Shipped",   color: "#7C3AED", bg: "#EDE9FE" },
  delivered: { label: "Delivered", color: "#059669", bg: "#D1FAE5" },
  cancelled: { label: "Cancelled", color: "#DC2626", bg: "#FEE2E2" },
};

const STATUSES = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

const formatRs = (n: number) => `Rs. ${n.toLocaleString("en-PK")}`;

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "#666", bg: "#eee" };
  return (
    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full capitalize"
      style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    setError("");
    ordersApi.getAll({ status: statusFilter, search })
      .then((res) => setOrders(res.orders))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchOrders(); };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await ordersApi.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder?.id === orderId) setSelectedOrder(updated);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout title="Orders">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A5]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, name, phone..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#E5E0D5] bg-white focus:outline-none focus:border-[#C8963E] transition-colors"
          />
        </form>

        {/* Status filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A5]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 text-sm rounded-xl border border-[#E5E0D5] bg-white appearance-none focus:outline-none focus:border-[#C8963E] cursor-pointer capitalize"
          >
            {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s === "all" ? "All Statuses" : s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#A0A0A5] pointer-events-none" />
        </div>

        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border border-[#E5E0D5] bg-white hover:bg-[#F5F0E8] transition-colors text-[#6B6B70]">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 border-2 border-[#C8963E] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] flex flex-col items-center justify-center py-20 gap-3">
          <Package className="w-12 h-12 text-[#D4C9B5]" />
          <p className="text-[#6B6B70] font-medium">No orders found</p>
          <p className="text-sm text-[#A0A0A5]">Place a test order from the store to see it here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9F7F2] border-b border-[#E5E0D5]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide hidden md:table-cell">Items</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#1C1C1E]">#{order.orderNumber}</p>
                      <p className="text-xs text-[#A0A0A5]">{new Date(order.createdAt).toLocaleDateString("en-PK")}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1C1C1E]">{order.customer.fullName}</p>
                      <p className="text-xs text-[#A0A0A5]">{order.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-[#4A4A50]">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                      <p className="text-xs text-[#A0A0A5]">{order.shipping.city}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#1C1C1E]">{formatRs(order.pricing.grandTotal)}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="appearance-none text-xs font-medium px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer pr-5 capitalize"
                          style={{
                            color: STATUS_CONFIG[order.status]?.color,
                            background: STATUS_CONFIG[order.status]?.bg,
                          }}
                        >
                          {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                            <option key={s} value={s} className="capitalize">{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 pointer-events-none" style={{ color: STATUS_CONFIG[order.status]?.color }} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 text-xs text-[#C8963E] hover:underline font-medium"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-[#F9F7F2] border-t border-[#E5E0D5]">
            <p className="text-xs text-[#A0A0A5]">{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#E5E0D5] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#1C1C1E]">Order #{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-[#A0A0A5]">{new Date(selectedOrder.createdAt).toLocaleString("en-PK")}</p>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wide mb-2">Customer</p>
                <p className="font-medium text-[#1C1C1E]">{selectedOrder.customer.fullName}</p>
                <p className="text-[#6B6B70]">{selectedOrder.customer.phone}</p>
                {selectedOrder.customer.email && <p className="text-[#6B6B70]">{selectedOrder.customer.email}</p>}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wide mb-2">Shipping Address</p>
                <p className="text-[#6B6B70]">{selectedOrder.shipping.address}</p>
                <p className="text-[#6B6B70]">{selectedOrder.shipping.city}{selectedOrder.shipping.postalCode ? `, ${selectedOrder.shipping.postalCode}` : ""}</p>
                {selectedOrder.shipping.notes && <p className="text-[#A0A0A5] italic mt-1">"{selectedOrder.shipping.notes}"</p>}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wide mb-2">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-[#F9F7F2] rounded-xl px-3 py-2">
                      <div>
                        <p className="font-medium text-[#1C1C1E]">{item.productName}</p>
                        <p className="text-xs text-[#A0A0A5]">Qty: {item.quantity} × {formatRs(item.price)}</p>
                      </div>
                      <p className="font-semibold text-[#1C1C1E]">{formatRs(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#F9F7F2] rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between text-[#6B6B70]"><span>Subtotal</span><span>{formatRs(selectedOrder.pricing.subtotal)}</span></div>
                <div className="flex justify-between text-[#6B6B70]"><span>Shipping</span><span className={selectedOrder.pricing.shipping === 0 ? "text-green-600" : ""}>{selectedOrder.pricing.shipping === 0 ? "Free" : formatRs(selectedOrder.pricing.shipping)}</span></div>
                <div className="flex justify-between font-bold text-[#1C1C1E] border-t border-[#E5E0D5] pt-1.5"><span>Total</span><span>{formatRs(selectedOrder.pricing.grandTotal)}</span></div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wide mb-2">Update Status</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="w-full border border-[#E5E0D5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8963E] capitalize"
                >
                  {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-5 border-t border-[#E5E0D5]">
              <button onClick={() => setSelectedOrder(null)} className="w-full bg-[#F5F0E8] hover:bg-[#EDE8DC] text-[#1C1C1E] font-medium py-2.5 rounded-xl transition-colors text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
