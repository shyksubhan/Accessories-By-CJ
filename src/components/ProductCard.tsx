import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import type { ApiProduct } from "@/lib/api";

interface ProductCardProps {
  product: ApiProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="glass-card group overflow-hidden flex flex-col border border-blue-50">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#EFF6FF]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#94A3B8] text-sm">
            No image
          </div>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#1A56DB] text-white text-[10px] font-semibold rounded-lg shadow-[0_2px_8px_rgba(26,86,219,0.3)] tracking-wide uppercase">
            {product.badge}
          </span>
        )}
        {/* Category tag */}
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-md text-[#475569] text-[10px] font-medium rounded-lg border border-blue-100/50">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-[#0F1629] leading-tight mb-1 line-clamp-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <Link to={`/product/${product.id}`} className="hover:text-[#1A56DB] transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-[#64748B] mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-lg font-bold text-[#0F1629]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#94A3B8] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                id: product.id,
                name: product.name,
                category: product.category as "Chargers" | "Cables" | "Power Banks" | "Earbuds" | "Cases",
                price: product.price,
                originalPrice: product.originalPrice ?? undefined,
                description: product.description,
                features: product.features,
                image: product.image,
                badge: product.badge ?? undefined,
              });
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1A56DB] text-sm font-medium rounded-xl transition-all duration-300 active:scale-95 border border-blue-100"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/checkout?product=${product.id}`);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#1A56DB] hover:bg-[#1345b8] text-white text-sm font-medium rounded-xl shadow-[0_4px_12px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_16px_rgba(26,86,219,0.35)] transition-all duration-300 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
