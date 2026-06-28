import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Zap, Check, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { productsApi, type ApiProduct } from "@/lib/api";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsApi.getById(id).then(setProduct).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1A56DB] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#0F1629] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Product not found
          </h2>
          <Link to="/products" className="text-[#1A56DB] hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#1A56DB] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden aspect-square bg-[#EFF6FF] border border-blue-100">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#94A3B8]">
                  No image available
                </div>
              )}
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#1A56DB] text-white text-xs font-semibold rounded-xl shadow-[0_4px_12px_rgba(26,86,219,0.3)]">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="text-xs font-medium text-[#1A56DB] uppercase tracking-wider mb-2 block" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {product.category}
            </span>
            <h1
              className="text-3xl md:text-4xl font-bold text-[#0F1629] mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {product.name}
            </h1>
            <p className="text-[#475569] leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-bold text-[#0F1629]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-[#94A3B8] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="px-2.5 py-1 bg-[#DBEAFE] text-[#1A56DB] text-xs font-semibold rounded-lg">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-10">
              <button
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  category: product.category as "Chargers" | "Cables" | "Power Banks" | "Earbuds" | "Cases",
                  price: product.price,
                  originalPrice: product.originalPrice ?? undefined,
                  description: product.description,
                  features: product.features,
                  image: product.image,
                  badge: product.badge ?? undefined,
                })}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1A56DB] font-medium rounded-xl transition-all duration-300 active:scale-[0.98] border border-blue-100"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={() => {
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
                  navigate(`/checkout?product=${product.id}`);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#1A56DB] hover:bg-[#1345b8] text-white font-medium rounded-xl shadow-[0_4px_16px_rgba(26,86,219,0.3)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.4)] transition-all duration-300 active:scale-[0.98]"
              >
                <Zap className="w-4 h-4" /> Buy It Now
              </button>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-[#EFF6FF] rounded-2xl p-6 mb-6 border border-blue-100">
                <h3
                  className="text-lg font-semibold text-[#0F1629] mb-4"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-[#334155]">
                      <Check className="w-4 h-4 text-[#1A56DB] shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/923120141004?text=Hi! I'm interested in: ${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#25D366] font-medium hover:underline"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Ask about this product on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
