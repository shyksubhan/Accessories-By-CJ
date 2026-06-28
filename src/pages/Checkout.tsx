import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, CreditCard, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { ordersApi, productsApi } from "@/lib/api";
import type { ApiProduct } from "@/lib/api";

// Bug 3 Fix: we no longer import `getProductById` from the local static data
// file. Instead, when the user arrives via ?product=<id> (direct-buy), we
// fetch the product from the live backend. This means price, stock status, and
// any admin edits are always reflected at checkout time.

export default function Checkout() {
  const { items, itemCount, total, clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Bug 3 Fix: directProduct now comes from the API, not local static data
  const [directProduct, setDirectProduct] = useState<ApiProduct | null>(null);
  const [directProductLoading, setDirectProductLoading] = useState(false);
  const [directProductError, setDirectProductError] = useState("");

  const [step, setStep] = useState<"form" | "confirm">("form");
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const productId = searchParams.get("product");

  // Bug 3 Fix: fetch product from API when productId is present
  useEffect(() => {
    if (!productId) return;
    setDirectProductLoading(true);
    setDirectProductError("");
    productsApi
      .getById(productId)
      .then((p) => setDirectProduct(p))
      .catch(() =>
        setDirectProductError(
          "Could not load product details. Please go back and try again."
        )
      )
      .finally(() => setDirectProductLoading(false));
  }, [productId]);

  // Unified order item shape for both direct-buy and cart flows
  const orderItems = directProduct
    ? [{ product: directProduct, quantity: 1 }]
    : items.map((i) => ({ product: i.product as unknown as ApiProduct, quantity: i.quantity }));

  const orderTotal = directProduct ? directProduct.price : total;
  const orderCount = directProduct ? 1 : itemCount;
  const shipping = orderTotal >= 3000 ? 0 : 250;
  const grandTotal = orderTotal + shipping;

  // Show loader while fetching direct product
  if (productId && directProductLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin w-8 h-8 mx-auto text-[#C8963E]"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="mt-3 text-sm text-[#6B6B70]">Loading product…</p>
        </div>
      </div>
    );
  }

  // Show error if direct product fetch failed
  if (productId && directProductError) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <p className="text-red-500 mb-4">{directProductError}</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#1C1C1E] mb-2">
            Nothing to checkout
          </h2>
          <p className="text-[#6B6B70]">Add items to your cart first.</p>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email || undefined,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode || undefined,
        notes: form.notes || undefined,
        items: orderItems.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
      };
      const res = await ordersApi.place(payload);
      setOrderNumber(res.order.orderNumber);
      setStep("confirm");
      if (!directProduct) clearCart();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to place order. Make sure the backend is running."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "confirm") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-[#8BA888]/15 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#5B8C5A]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1C1C1E] mb-2 font-['Playfair_Display']">
            Order Confirmed!
          </h2>
          <p className="text-[#6B6B70] mb-2">
            Thank you for your order. Your order number is{" "}
            <strong className="text-[#1C1C1E]">#{orderNumber}</strong>
          </p>
          <p className="text-sm text-[#A0A0A5] mb-8">
            We'll contact you on WhatsApp for payment and delivery details.
          </p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-[#6B6B70] hover:text-[#C8963E] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <h1 className="section-title mb-8">Checkout</h1>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-4">
                  Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      name="fullName"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={handleChange}
                      className="premium-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      className="premium-input"
                      placeholder="03XX XXXXXXX"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="premium-input"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-4">
                  Shipping Address
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">
                      Address *
                    </label>
                    <input
                      name="address"
                      type="text"
                      required
                      value={form.address}
                      onChange={handleChange}
                      className="premium-input"
                      placeholder="House No, Street, Area"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">
                        City *
                      </label>
                      <input
                        name="city"
                        type="text"
                        required
                        value={form.city}
                        onChange={handleChange}
                        className="premium-input"
                        placeholder="Lahore"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">
                        Postal Code
                      </label>
                      <input
                        name="postalCode"
                        type="text"
                        value={form.postalCode}
                        onChange={handleChange}
                        className="premium-input"
                        placeholder="54000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">
                      Order Notes
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      className="premium-textarea"
                      placeholder="Any special instructions..."
                    />
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-4">
                  Payment Method
                </h3>
                <p className="text-sm text-[#6B6B70] mb-2">
                  We offer Cash on Delivery across Pakistan. Our team will
                  contact you on WhatsApp to confirm your order and arrange
                  payment.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <CreditCard className="w-5 h-5 text-[#C8963E]" />
                  <span className="text-sm font-medium text-[#1C1C1E]">
                    Cash on Delivery
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Place Order — {formatPrice(grandTotal)}</>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-28">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {orderItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#F5F0E8]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#1C1C1E] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[#A0A0A5]">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-[#1C1C1E] shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E5E0D5] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B70]">Subtotal</span>
                  <span className="text-[#1C1C1E] font-medium">
                    {formatPrice(orderTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B70]">Shipping</span>
                  <span
                    className={
                      shipping === 0
                        ? "text-[#8BA888] font-medium"
                        : "text-[#1C1C1E] font-medium"
                    }
                  >
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="border-t border-[#E5E0D5] pt-2 flex justify-between">
                  <span className="text-base font-semibold text-[#1C1C1E]">
                    Total
                  </span>
                  <span className="text-base font-bold text-[#1C1C1E]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#A0A0A5]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8BA888]" />
                Secure checkout. Your data is safe.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
