import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search, Package, CheckCircle, Truck, Home, Clock, XCircle, MessageSquare
} from "lucide-react";
import { ordersApi, type ApiOrder } from "@/lib/api";

const TRACKING_STEPS = [
  { key: "pending",   label: "Order Placed",     icon: Package,       desc: "Your order has been received" },
  { key: "confirmed", label: "Order Confirmed",  icon: CheckCircle,   desc: "We've confirmed your order" },
  { key: "shipped",   label: "Out for Delivery", icon: Truck,         desc: "Your order is on its way" },
  { key: "delivered", label: "Delivered",        icon: Home,          desc: "Your order has been delivered" },
];

const STATUS_ORDER = ["pending", "confirmed", "shipped", "delivered"];

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-PK", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatPrice(n: number) {
  return `Rs. ${n.toLocaleString("en-PK")}`;
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("order") || "");
  const [input, setInput] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      // Search orders by order number
      const { orders } = await ordersApi.getAll({ search: q.trim(), limit: 5 });
      const found = orders.find(
        (o) => o.orderNumber.toLowerCase() === q.trim().toLowerCase() ||
               o.customer.phone.replace(/\s/g, "") === q.trim().replace(/\s/g, "")
      );
      if (found) {
        setOrder(found);
      } else if (orders.length === 1) {
        setOrder(orders[0]);
      } else {
        setOrder(null);
        setError("No order found with that order number or phone. Please check and try again.");
      }
    } catch {
      setError("Unable to retrieve order. Please try again.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) handleSearch(query);
  }, []);

  const currentStep = order ? STATUS_ORDER.indexOf(order.status) : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-[#1A56DB]" />
          </div>
          <h1 className="section-title mb-2">Track Your Order</h1>
          <p className="section-subtitle">Enter your order number or phone number to see real-time status</p>
        </div>

        {/* Search Box */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setQuery(input); handleSearch(input); } }}
              className="premium-input pl-11 py-3.5"
              placeholder="Order # (e.g. CJ-2026-001) or phone number"
            />
          </div>
          <button
            onClick={() => { setQuery(input); handleSearch(input); }}
            disabled={loading || !input.trim()}
            className="btn-primary px-6 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Track"
            )}
          </button>
        </div>

        {/* Results */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-600">{error}</p>
            <a
              href="https://wa.me/923120141004"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#25D366] font-medium hover:underline"
            >
              <MessageSquare className="w-4 h-4" /> Ask on WhatsApp
            </a>
          </div>
        )}

        {order && !loading && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(26,86,219,0.06)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-[#94A3B8] mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>ORDER NUMBER</p>
                  <h2 className="text-xl font-bold text-[#0F1629]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    #{order.orderNumber}
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-1">Placed {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#94A3B8] mb-1">TOTAL</p>
                  <p className="text-lg font-bold text-[#0F1629]">{formatPrice(order.pricing.grandTotal)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-[#F8FAFC] rounded-xl p-4 mb-4">
                <p className="text-xs font-medium text-[#94A3B8] mb-2">ITEMS</p>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-[#475569] py-1">
                    <span>{item.productName} × {item.quantity}</span>
                    <span>{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              {/* Delivery */}
              <div className="flex items-start gap-2 text-sm text-[#64748B]">
                <Home className="w-4 h-4 text-[#1A56DB] shrink-0 mt-0.5" />
                <span>{order.shipping.address}, {order.shipping.city}</span>
              </div>
            </div>

            {/* Tracking Timeline */}
            {isCancelled ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                <h3 className="font-semibold text-red-700 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Order Cancelled</h3>
                <p className="text-sm text-red-600">This order has been cancelled. Contact us on WhatsApp for assistance.</p>
              </div>
            ) : (
              <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(26,86,219,0.06)]">
                <h3 className="text-base font-semibold text-[#0F1629] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Order Status
                </h3>
                <div className="relative">
                  {/* Progress line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#DBEAFE]" />
                  <div
                    className="absolute left-6 top-6 w-0.5 bg-[#1A56DB] transition-all duration-700"
                    style={{ height: currentStep >= 0 ? `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%` : "0%" }}
                  />

                  <div className="space-y-6">
                    {TRACKING_STEPS.map((step, i) => {
                      const isCompleted = i <= currentStep;
                      const isCurrent = i === currentStep;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.key} className="flex items-start gap-4 relative">
                          {/* Circle */}
                          <div
                            className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
                              isCompleted
                                ? "bg-[#1A56DB] border-[#1A56DB]"
                                : "bg-white border-[#DBEAFE]"
                            } ${isCurrent ? "shadow-[0_0_0_4px_rgba(26,86,219,0.15)]" : ""}`}
                          >
                            <StepIcon className={`w-5 h-5 ${isCompleted ? "text-white" : "text-[#CBD5E1]"}`} />
                          </div>
                          {/* Content */}
                          <div className="flex-1 pt-2.5">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-semibold ${isCompleted ? "text-[#0F1629]" : "text-[#94A3B8]"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {step.label}
                              </p>
                              {isCurrent && (
                                <span className="px-2 py-0.5 bg-[#1A56DB] text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 ${isCompleted ? "text-[#64748B]" : "text-[#CBD5E1]"}`}>{step.desc}</p>
                            {isCurrent && (
                              <p className="text-xs text-[#1A56DB] mt-1 font-medium">
                                Updated {formatDate(order.updatedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp tracking */}
            <div className="bg-[#F0FDF4] border border-green-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#16a34a]">Get Live Updates</p>
                <p className="text-xs text-[#64748B]">Contact us on WhatsApp for live tracking information</p>
              </div>
              <a
                href={`https://wa.me/923120141004?text=Hi! I want to track my order: ${order.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#16a34a] hover:underline whitespace-nowrap"
              >
                Chat Now →
              </a>
            </div>
          </div>
        )}

        {/* Initial state */}
        {!searched && !loading && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-[#BFDBFE] mx-auto mb-4" />
            <p className="text-sm text-[#94A3B8]">Enter your order number above to see your order status</p>
          </div>
        )}
      </div>
    </div>
  );
}
