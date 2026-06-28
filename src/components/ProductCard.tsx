import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { type Product, formatPrice } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="glass-card group overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#F5F0E8]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#C8963E] text-white text-[10px] font-semibold rounded-lg shadow-[0_2px_8px_rgba(200,150,62,0.3)] tracking-wide uppercase">
            {product.badge}
          </span>
        )}
        {/* Category tag */}
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/80 backdrop-blur-md text-[#6B6B70] text-[10px] font-medium rounded-lg border border-white/30">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-['Playfair_Display'] text-base font-semibold text-[#1C1C1E] leading-tight mb-1 line-clamp-2">
          <Link to={`/product/${product.id}`} className="hover:text-[#C8963E] transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-[#6B6B70] mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-lg font-bold text-[#1C1C1E]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#A0A0A5] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#F0EBE1] hover:bg-[#E5DED0] text-[#4A4A50] text-sm font-medium rounded-xl transition-all duration-300 active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/checkout?product=${product.id}`);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#C8963E] hover:bg-[#B8872E] text-white text-sm font-medium rounded-xl shadow-[0_4px_12px_rgba(200,150,62,0.25)] hover:shadow-[0_6px_16px_rgba(200,150,62,0.35)] transition-all duration-300 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
