import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function Cart() {
  const { items, itemCount, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#F0EBE1] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-[#C8963E]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1C1C1E] mb-2 font-['Playfair_Display']">
            Your cart is empty
          </h2>
          <p className="text-[#6B6B70] mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="section-title mb-1">Shopping Cart</h1>
            <p className="text-sm text-[#6B6B70]">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-[#A0A0A5] hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="glass-card p-5 flex gap-4">
                <Link to={`/product/${item.product.id}`} className="shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl bg-[#F5F0E8]"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product.id}`}
                    className="font-['Playfair_Display'] text-base font-semibold text-[#1C1C1E] hover:text-[#C8963E] transition-colors line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-[#A0A0A5] mb-3">{item.product.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-[#F0EBE1] hover:bg-[#E5E0D5] flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#4A4A50]" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-[#1C1C1E]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-[#F0EBE1] hover:bg-[#E5E0D5] flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#4A4A50]" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-semibold text-[#1C1C1E]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-[#A0A0A5] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-[#6B6B70] hover:text-[#C8963E] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-28">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-6">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B70]">Subtotal ({itemCount} items)</span>
                  <span className="text-[#1C1C1E] font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B70]">Shipping</span>
                  <span className="text-[#8BA888] font-medium">
                    {total >= 3000 ? "Free" : formatPrice(250)}
                  </span>
                </div>
                {total < 3000 && (
                  <p className="text-xs text-[#C8963E]">
                    Add {formatPrice(3000 - total)} more for free shipping
                  </p>
                )}
                <div className="border-t border-[#E5E0D5] pt-3 flex justify-between">
                  <span className="text-base font-semibold text-[#1C1C1E]">Total</span>
                  <span className="text-base font-bold text-[#1C1C1E]">
                    {formatPrice(total >= 3000 ? total : total + 250)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
