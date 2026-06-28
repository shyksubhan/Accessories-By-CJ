import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Package, Truck, HelpCircle, ShoppingBag,
  Edit3, Save, X, ChevronRight, Clock, CheckCircle,
  AlertCircle, XCircle, MapPin
} from "lucide-react";
import { ordersApi, type ApiOrder } from "@/lib/api";

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800",    icon: CheckCircle },
  shipped:   { label: "Shipped",   color: "bg-indigo-100 text-indigo-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800",   icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800",       icon: XCircle },
};

function formatPrice(n: number) {
  return `Rs. ${n.toLocaleString("en-PK")}`;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem("cj_user_profile");
    return stored ? JSON.parse(stored) : { name: "", phone: "", email: "", address: "", city: "" };
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [searched, setSearched] = useState(false);

  const hasProfile = Boolean(profile.name && profile.phone);

  const saveProfile = () => {
    setProfile(draft);
    localStorage.setItem("cj_user_profile", JSON.stringify(draft));
    setEditing(false);
  };

  const fetchOrders = async (phone: string) => {
    setLoadingOrders(true);
    setOrdersError("");
    try {
      // Search orders by customer phone via admin endpoint isn't publicly available,
      // so we show orders based on stored phone
      const { orders: data } = await ordersApi.getAll({ search: phone, limit: 20 });
      setOrders(data);
      setSearched(true);
    } catch {
      setOrdersError("Could not load orders. Please try again.");
      setSearched(true);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (hasProfile && profile.phone) {
      fetchOrders(profile.phone);
    }
  }, [profile.phone, hasProfile]);

  const isProfileComplete = hasProfile;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-[#EFF6FF] flex items-center justify-center mx-auto mb-4 border-4 border-[#DBEAFE]">
            <User className="w-10 h-10 text-[#1A56DB]" />
          </div>
          <h1 className="section-title mb-1">
            {isProfileComplete ? `Hi, ${profile.name.split(" ")[0]}! 👋` : "My Profile"}
          </h1>
          <p className="section-subtitle">
            {isProfileComplete ? "Manage your profile and track your orders." : "Create your profile to track orders and get support."}
          </p>
        </div>

        {/* ─── Quick Actions ─── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Truck, label: "Track Order", sub: "Real-time tracking", action: () => navigate("/track-order"), color: "text-[#1A56DB] bg-[#EFF6FF]" },
            { icon: HelpCircle, label: "Get Help", sub: "Contact support", action: () => navigate("/contact"), color: "text-[#16a34a] bg-[#F0FDF4]" },
            { icon: ShoppingBag, label: "Explore Shop", sub: "Browse products", action: () => navigate("/products"), color: "text-[#d97706] bg-[#FFFBEB]" },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className="flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border border-blue-50 bg-white shadow-[0_4px_16px_rgba(26,86,219,0.05)] hover:shadow-[0_8px_24px_rgba(26,86,219,0.1)] hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${btn.color.split(" ")[1]}`}>
                <btn.icon className={`w-6 h-6 ${btn.color.split(" ")[0]}`} />
              </div>
              <p className="text-sm font-semibold text-[#0F1629]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{btn.label}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">{btn.sub}</p>
            </button>
          ))}
        </div>

        {/* ─── Profile Card ─── */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_4px_20px_rgba(26,86,219,0.06)] p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#0F1629]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Profile Details
            </h2>
            {!editing ? (
              <button
                onClick={() => { setDraft(profile); setEditing(true); }}
                className="inline-flex items-center gap-1.5 text-sm text-[#1A56DB] font-medium hover:underline"
              >
                <Edit3 className="w-4 h-4" />
                {isProfileComplete ? "Edit" : "Create Profile"}
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={saveProfile} className="inline-flex items-center gap-1.5 text-sm bg-[#1A56DB] text-white px-4 py-1.5 rounded-lg font-medium hover:bg-[#1345b8] transition-colors">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1.5 text-sm bg-[#F1F5F9] text-[#64748B] px-3 py-1.5 rounded-lg font-medium hover:bg-[#E2E8F0] transition-colors">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name *", key: "name", type: "text", placeholder: "Your full name" },
                { label: "Phone Number *", key: "phone", type: "tel", placeholder: "03XX XXXXXXX" },
                { label: "Email", key: "email", type: "email", placeholder: "your@email.com" },
                { label: "City", key: "city", type: "text", placeholder: "e.g. Lahore" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-[#334155] mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={draft[field.key as keyof UserProfile]}
                    onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                    className="premium-input"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Delivery Address</label>
                <input
                  type="text"
                  value={draft.address}
                  onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                  className="premium-input"
                  placeholder="House #, Street, Area"
                />
              </div>
            </div>
          ) : isProfileComplete ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: profile.name, icon: User },
                { label: "Phone", value: profile.phone, icon: HelpCircle },
                { label: "Email", value: profile.email || "—", icon: HelpCircle },
                { label: "City", value: profile.city || "—", icon: MapPin },
              ].map((item) => (
                <div key={item.label} className="bg-[#F8FAFC] rounded-xl p-4">
                  <p className="text-xs text-[#94A3B8] mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-[#0F1629]">{item.value}</p>
                </div>
              ))}
              {profile.address && (
                <div className="sm:col-span-2 bg-[#F8FAFC] rounded-xl p-4">
                  <p className="text-xs text-[#94A3B8] mb-1">Delivery Address</p>
                  <p className="text-sm font-medium text-[#0F1629]">{profile.address}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-[#BFDBFE] mx-auto mb-3" />
              <p className="text-sm text-[#94A3B8] mb-4">No profile created yet. Click "Create Profile" to get started.</p>
            </div>
          )}
        </div>

        {/* ─── Orders Section ─── */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_4px_20px_rgba(26,86,219,0.06)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#0F1629]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              My Orders
            </h2>
            <button
              onClick={() => navigate("/track-order")}
              className="inline-flex items-center gap-1.5 text-sm text-[#1A56DB] font-medium hover:underline"
            >
              Track Order <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Manual phone search (if no profile) */}
          {!hasProfile && (
            <div className="mb-6 flex gap-2">
              <input
                type="tel"
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                className="premium-input flex-1"
                placeholder="Enter your phone number to see orders"
              />
              <button
                onClick={() => fetchOrders(phoneSearch)}
                disabled={!phoneSearch || loadingOrders}
                className="btn-primary px-5 py-3 disabled:opacity-50"
              >
                Search
              </button>
            </div>
          )}

          {/* Orders List */}
          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : ordersError ? (
            <div className="text-center py-12">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">{ordersError}</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const StatusIcon = status.icon;
                return (
                  <div key={order.id} className="bg-[#F8FAFC] rounded-xl p-4 border border-blue-50">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-[#0F1629] text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          #{order.orderNumber}
                        </p>
                        <p className="text-xs text-[#94A3B8]">{formatDate(order.createdAt)}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                    <div className="text-xs text-[#64748B] mb-3">
                      {order.items.map((item) => (
                        <span key={item.id}>{item.productName} (x{item.quantity}) </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-[#0F1629]">{formatPrice(order.pricing.grandTotal)}</p>
                      <button
                        onClick={() => navigate(`/track-order?order=${order.orderNumber}`)}
                        className="text-xs text-[#1A56DB] font-medium hover:underline inline-flex items-center gap-1"
                      >
                        Track <Truck className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : searched ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-[#BFDBFE] mx-auto mb-3" />
              <p className="text-sm text-[#94A3B8]">No orders found. Place your first order!</p>
              <button
                onClick={() => navigate("/products")}
                className="mt-4 btn-primary text-sm px-6 py-2.5"
              >
                Shop Now
              </button>
            </div>
          ) : !hasProfile ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-[#BFDBFE] mx-auto mb-3" />
              <p className="text-sm text-[#94A3B8]">Enter your phone number above to see your orders.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
