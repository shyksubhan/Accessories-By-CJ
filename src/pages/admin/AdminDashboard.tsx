import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, type AdminStats } from "@/lib/api";
import { ShoppingBag, DollarSign, MessageSquare, Shield, TrendingUp, Package, AlertCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  pending:   "#F59E0B",
  confirmed: "#1A56DB",
  shipped:   "#8B5CF6",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

function StatCard({ label, value, sub, icon: Icon, color, bg }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#0F1629]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}
      </p>
      <p className="text-sm font-medium text-[#64748B] mt-0.5">{label}</p>
      {sub && <p className="text-xs text-[#94A3B8] mt-1">{sub}</p>}
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
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#94A3B8]">Loading dashboard...</p>
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
          <p className="text-xs text-red-400 mt-1">Make sure the backend server is running.</p>
        </div>
      </div>
    </AdminLayout>
  );

  if (!stats) return null;

  return (
    <AdminLayout title="Dashboard">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Orders"    value={stats.orders.total}         sub={`${stats.orders.pending} pending`}    icon={ShoppingBag}  color="#1A56DB" bg="#EFF6FF" />
        <StatCard label="Total Revenue"   value={formatRs(stats.revenue.total)} sub="Excl. cancelled"                  icon={DollarSign}   color="#10B981" bg="#F0FDF4" />
        <StatCard label="Messages"        value={stats.messages.total}       sub={`${stats.messages.unread} unread`}   icon={MessageSquare} color="#8B5CF6" bg="#F5F3FF" />
        <StatCard label="Warranty Claims" value={stats.warranty.total}       sub={`${stats.warranty.open} open`}       icon={Shield}       color="#F59E0B" bg="#FFFBEB" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#1A56DB]" />
            <h3 className="text-sm font-semibold text-[#0F1629]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Revenue — Last 7 Days
            </h3>
          </div>
          {stats.revenue.byDay.every((d) => d.revenue === 0) ? (
            <div className="flex items-center justify-center h-40 text-[#94A3B8] text-sm">
              No orders yet. Place a test order to see data.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={stats.revenue.byDay} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1A56DB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1A56DB" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false}
                  tickFormatter={(d) => new Date(d).toLocaleDateString("en", { weekday: "short" })} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `Rs.${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #DBEAFE", background: "#fff" }}
                  formatter={(v: number) => [formatRs(v), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1A56DB" strokeWidth={2} fill="url(#revGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-[#1A56DB]" />
            <h3 className="text-sm font-semibold text-[#0F1629]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Orders by Status
            </h3>
          </div>
          {stats.orders.total === 0 ? (
            <div className="flex items-center justify-center h-40 text-[#94A3B8] text-sm">No orders yet</div>
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
                      <span className="capitalize text-[#64748B]">{s.status}</span>
                    </div>
                    <span className="font-medium text-[#0F1629]">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-blue-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#0F1629]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Recent Orders
            </h3>
            <a href="/admin/orders" className="text-xs text-[#1A56DB] hover:underline font-medium">View all</a>
          </div>
          {stats.recentOrders.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[#94A3B8] text-sm">No orders yet</div>
          ) : (
            <div className="divide-y divide-blue-50">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="px-5 py-3 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#0F1629]">#{o.orderNumber}</p>
                    <p className="text-xs text-[#94A3B8]">{o.customerName} · {o.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#0F1629]">{formatRs(o.grandTotal)}</p>
                    <span
                      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize mt-0.5"
                      style={{ background: `${STATUS_COLORS[o.status]}20`, color: STATUS_COLORS[o.status] }}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-blue-50">
            <h3 className="text-sm font-semibold text-[#0F1629]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Top Selling Products
            </h3>
          </div>
          {stats.topProducts.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[#94A3B8] text-sm">No sales data yet</div>
          ) : (
            <div className="divide-y divide-blue-50">
              {stats.topProducts.map((p, i) => (
                <div key={p.product_name} className="px-5 py-3 flex items-center gap-3 hover:bg-[#F8FAFC] transition-colors">
                  <span className="w-6 h-6 rounded-full bg-[#EFF6FF] flex items-center justify-center text-xs font-bold text-[#1A56DB]">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F1629] truncate">{p.product_name}</p>
                    <p className="text-xs text-[#94A3B8]">{p.totalSold} units sold</p>
                  </div>
                  <p className="text-sm font-semibold text-[#0F1629] shrink-0">{formatRs(p.totalRevenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
