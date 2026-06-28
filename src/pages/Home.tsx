import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Zap, Shield, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { productsApi, type ApiProduct } from "@/lib/api";
import { formatPrice } from "@/data/products";

const categoryIcons: Record<string, string> = {
  Chargers: "🔌",
  Cables: "🔗",
  "Power Banks": "🔋",
  Earbuds: "🎧",
  Cases: "📱",
};

const categories = ["Chargers", "Cables", "Power Banks", "Earbuds", "Cases"];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    productsApi.getAll().then((all) => {
      const featured = all.filter((p) => p.badge === "Best Seller" || p.badge === "Premium").slice(0, 4);
      setFeaturedProducts(featured);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#EFF6FF] to-[#DBEAFE]/60">
        {/* Background decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#1A56DB]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3B82F6]/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1A56DB]/3 rounded-full blur-3xl" />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#1A56DB]/30 animate-float-particle"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.4}s`,
            }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Animated badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A56DB]/10 border border-[#1A56DB]/20 mb-8 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#1A56DB] animate-pulse" />
            <span
              className="text-xs font-semibold text-[#1A56DB] tracking-widest uppercase"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Style Meets Performance
            </span>
          </div>

          {/* Central logo animation */}
          <div className="relative w-52 h-52 md:w-64 md:h-64 mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#1A56DB]/20 animate-spin-slow" />
            {/* Middle pulsing ring */}
            <div className="absolute inset-4 rounded-full border border-[#1A56DB]/15 animate-pulse-ring" />
            {/* Inner ring */}
            <div className="absolute inset-8 rounded-full border-2 border-[#1A56DB]/30 animate-spin-reverse" />
            {/* Glow */}
            <div className="absolute inset-10 rounded-full bg-gradient-to-br from-[#1A56DB]/10 to-[#3B82F6]/5 blur-md" />
            {/* Logo */}
            <div className="absolute inset-0 flex items-center justify-center animate-logo-float">
              <img
                src="/logo.png"
                alt="Accessories By CJ"
                className="w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-[0_8px_24px_rgba(26,86,219,0.2)]"
              />
            </div>
            {/* Corner sparkles */}
            {[0, 90, 180, 270].map((deg, i) => (
              <div
                key={deg}
                className="absolute w-3 h-3 rounded-full bg-[#1A56DB] animate-pulse"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${deg}deg) translateX(100px) translateY(-50%)`,
                  animationDelay: `${i * 0.5}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>

          {/* Heading */}
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F1629] leading-tight mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Accessories
            </h1>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient leading-tight mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              by CJ
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-[#475569] max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.4s", fontFamily: "'Inter', sans-serif" }}
          >
            Premium mobile accessories — chargers, cables, power banks, earbuds & cases —
            designed where <span className="text-[#1A56DB] font-semibold">style meets performance</span>.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex gap-4 flex-wrap justify-center animate-slide-up"
            style={{ animationDelay: "0.5s" }}
          >
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="btn-outline inline-flex items-center gap-2 text-base px-8 py-4"
            >
              Our Story
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className="flex items-center justify-center gap-8 mt-12 animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            {[
              { icon: Zap, text: "Fast Delivery" },
              { icon: Shield, text: "Warranty Covered" },
              { icon: Star, text: "Premium Quality" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-[#64748B]">
                <item.icon className="w-4 h-4 text-[#1A56DB]" />
                <span style={{ fontFamily: "'Outfit', sans-serif" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── Categories Section ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what your device needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="glass-card p-6 flex flex-col items-center text-center group border border-blue-50"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {categoryIcons[cat]}
                </span>
                <h3
                  className="text-sm font-semibold text-[#0F1629] group-hover:text-[#1A56DB] transition-colors"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {cat}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-[#EFF6FF]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-title">Featured Products</h2>
                <p className="section-subtitle">Our most loved accessories</p>
              </div>
              <Link
                to="/products"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#1A56DB] hover:text-[#1345b8] transition-colors"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA Banner ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0F1629] via-[#1A2744] to-[#0F1629] p-10 md:p-16 text-center">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#1A56DB]/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#3B82F6]/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Need Help Choosing?
              </h2>
              <p className="text-[#94A3B8] max-w-md mx-auto mb-8 leading-relaxed">
                Our team is here to help you find the perfect accessory for your device. Reach out anytime on WhatsApp.
              </p>
              <a
                href="https://wa.me/923120141004"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3.5 rounded-xl font-medium shadow-[0_8px_24px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.4)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Chat on WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
