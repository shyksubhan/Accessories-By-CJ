import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, type AdminStats } from "@/lib/api";
import { ShoppingBag, DollarSign, MessageSquare, Shield, TrendingUp, Package, AlertCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  confirmed: "#3B82F6",
  shipped: "#8B5CF6",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E0D5] shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#1C1C1E]">{value}</p>
      <p className="text-sm font-medium text-[#6B6B70] mt-0.5">{label}</p>
      {sub && <p className="text-xs text-[#A0A0A5] mt-1">{sub}</p>}
    </div>
  );
}

const formatRs = (n: number) => `Rs. ${n.toLocaleString("en-PK")}`;

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout title="Dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C8963E] border-t-transparent rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout title="Dashboard">
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-600">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-medium">Failed to load dashboard</p>
          <p className="text-sm text-red-500 mt-0.5">{error}</p>
          <p className="text-xs text-red-400 mt-1">Make sure the backend server is running on port 3001.</p>
        </div>
      </div>
    </AdminLayout>
  );

  if (!stats) return null;

  return (
    <AdminLayout title="Dashboard">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Orders" value={stats.orders.total} sub={`${stats.orders.pending} pending`} icon={ShoppingBag} color="#C8963E" />
        <StatCard label="Total Revenue" value={formatRs(stats.revenue.total)} sub="Excl. cancelled" icon={DollarSign} color="#10B981" />
        <StatCard label="Messages" value={stats.messages.total} sub={`${stats.messages.unread} unread`} icon={MessageSquare} color="#3B82F6" />
        <StatCard label="Warranty Claims" value={stats.warranty.total} sub={`${stats.warranty.open} open`} icon={Shield} color="#8B5CF6" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#E5E0D5] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#C8963E]" />
            <h3 className="text-sm font-semibold text-[#1C1C1E]">Revenue — Last 7 Days</h3>
          </div>
          {stats.revenue.byDay.every((d) => d.revenue === 0) ? (
            <div className="flex items-center justify-center h-40 text-[#A0A0A5] text-sm">
              No orders yet. Place a test order to see data here.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={stats.revenue.byDay} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8963E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C8963E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#A0A0A5" }} tickLine={false} axisLine={false}
                  tickFormatter={(d) => new Date(d).toLocaleDateString("en", { weekday: "short" })} />
                <YAxis tick={{ fontSize: 10, fill: "#A0A0A5" }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `Rs.${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E0D5", background: "#fff" }}
                  formatter={(v: number) => [formatRs(v), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C8963E" strokeWidth={2} fill="url(#revGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E0D5] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-[#C8963E]" />
            <h3 className="text-sm font-semibold text-[#1C1C1E]">Orders by Status</h3>
          </div>
          {stats.orders.total === 0 ? (
            <div className="flex items-center justify-center h-40 text-[#A0A0A5] text-sm">No orders yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={stats.orders.byStatus.filter((s) => s.count > 0)}
                    dataKey="count" nameKey="status"
                    cx="50%" cy="50%" outerRadius={60} innerRadius={36}
                  >
                    {stats.orders.byStatus.filter((s) => s.count > 0).map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#ccc"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {stats.orders.byStatus.filter((s) => s.count > 0).map((s) => (
                  <div key={s.status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[s.status] }} />
                      <span className="capitalize text-[#6B6B70]">{s.status}</span>
                    </div>
                    <span className="font-medium text-[#1C1C1E]">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E0D5] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1C1C1E]">Recent Orders</h3>
            <a href="/admin/orders" className="text-xs text-[#C8963E] hover:underline font-medium">View all</a>
          </div>
          {stats.recentOrders.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[#A0A0A5] text-sm">No orders yet</div>
          ) : (
            <div className="divide-y divide-[#F0EBE0]">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">#{o.orderNumber}</p>
                    <p className="text-xs text-[#A0A0A5]">{o.customerName} · {o.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1C1C1E]">{formatRs(o.grandTotal)}</p>
                    <span
                      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize mt-0.5"
                      style={{ background: `${STATUS_COLORS[o.status]}20`, color: STATUS_COLORS[o.status] }}
                    >{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E0D5]">
            <h3 className="text-sm font-semibold text-[#1C1C1E]">Top Selling Products</h3>
          </div>
          {stats.topProducts.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[#A0A0A5] text-sm">No sales data yet</div>
          ) : (
            <div className="divide-y divide-[#F0EBE0]">
              {stats.topProducts.map((p, i) => (
                <div key={p.product_name} className="px-5 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#F5F0E8] flex items-center justify-center text-xs font-bold text-[#C8963E]">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1C1E] truncate">{p.product_name}</p>
                    <p className="text-xs text-[#A0A0A5]">{p.totalSold} units sold</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1C1C1E] shrink-0">{formatRs(p.totalRevenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
