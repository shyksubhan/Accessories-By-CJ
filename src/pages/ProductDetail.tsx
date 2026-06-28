import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Zap, ShieldCheck, Truck, RefreshCw, Star, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductById, formatPrice } from "@/data/products";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = getProductById(id || "");

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#1C1C1E] mb-2">Product not found</h2>
          <Link to="/products" className="text-[#C8963E] hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-[#6B6B70] hover:text-[#C8963E] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="glass rounded-[2rem] overflow-hidden aspect-square bg-[#F5F0E8]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#C8963E] text-white text-xs font-semibold rounded-xl shadow-[0_4px_12px_rgba(200,150,62,0.3)]">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="text-xs font-medium text-[#C8963E] uppercase tracking-wider mb-2 block">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#1C1C1E] mb-3 font-['Playfair_Display']">
              {product.name}
            </h1>
            <p className="text-[#6B6B70] leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-bold text-[#1C1C1E]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-[#A0A0A5] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="px-2.5 py-1 bg-[#8BA888]/15 text-[#5B8C5A] text-xs font-semibold rounded-lg">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-10">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#F0EBE1] hover:bg-[#E5DED0] text-[#1C1C1E] font-medium rounded-xl transition-all duration-300 active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product);
                  navigate(`/checkout?product=${product.id}`);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#C8963E] hover:bg-[#B8872E] text-white font-medium rounded-xl shadow-[0_4px_16px_rgba(200,150,62,0.3)] hover:shadow-[0_6px_20px_rgba(200,150,62,0.4)] transition-all duration-300 active:scale-[0.98]"
              >
                <Zap className="w-4 h-4" /> Buy It Now
              </button>
            </div>

            {/* Features */}
            <div className="glass rounded-2xl p-6 mb-8">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-4">
                Key Features
              </h3>
              <ul className="space-y-3">
                {product.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-[#4A4A50]">
                    <Check className="w-4 h-4 text-[#8BA888] shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Above Rs. 3,000" },
                { icon: ShieldCheck, label: "1 Year Warranty", sub: "Full Coverage" },
                { icon: RefreshCw, label: "Easy Returns", sub: "7 Day Policy" },
              ].map((badge) => (
                <div key={badge.label} className="glass rounded-xl p-3 text-center">
                  <badge.icon className="w-5 h-5 text-[#C8963E] mx-auto mb-1.5" />
                  <p className="text-[10px] font-semibold text-[#1C1C1E] leading-tight">{badge.label}</p>
                  <p className="text-[10px] text-[#A0A0A5]">{badge.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
