import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Star, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, categories, formatPrice } from "@/data/products";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On orders above Rs. 3,000 across Pakistan",
  },
  {
    icon: ShieldCheck,
    title: "1 Year Warranty",
    desc: "All products backed by our premium warranty",
  },
  {
    icon: RefreshCw,
    title: "7-Day Returns",
    desc: "Easy hassle-free returns & exchanges",
  },
];

const categoryIcons: Record<string, string> = {
  Chargers: "🔌",
  Cables: "🔗",
  "Power Banks": "🔋",
  Earbuds: "🎧",
  Cases: "📱",
};

export default function Home() {
  const featuredProducts = products.filter((p) => p.badge === "Best Seller" || p.badge === "Premium").slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0E8] via-[#FAF7F2] to-[#F0EBE1]" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#C8963E]/10 to-[#8BA888]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#C8963E]/8 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C8963E]/10 border border-[#C8963E]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C8963E] animate-pulse" />
                <span className="text-xs font-medium text-[#C8963E] tracking-wide uppercase">
                  Premium Mobile Accessories
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1C1C1E] leading-[1.08] tracking-tight mb-5">
                Elevate Your
                <br />
                <span className="text-gradient">Device Experience</span>
              </h1>
              <p className="text-lg text-[#6B6B70] leading-relaxed mb-8 max-w-lg">
                Discover our curated collection of premium mobile accessories — chargers, cables, power banks, earbuds, and cases designed for those who settle for nothing less.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  to="/products"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Shop Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="btn-outline"
                >
                  Our Story
                </Link>
              </div>
            </div>
            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8963E]/20 to-[#8BA888]/20 rounded-[2.5rem] rotate-6" />
                <div className="absolute inset-0 glass rounded-[2.5rem] overflow-hidden -rotate-3 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                  <img
                    src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80"
                    alt="Premium Accessories"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 glass-card p-4 flex items-center gap-3 animate-float">
                  <div className="w-10 h-10 rounded-xl bg-[#8BA888]/15 flex items-center justify-center">
                    <Star className="w-5 h-5 text-[#8BA888] fill-[#8BA888]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#A0A0A5]">Trusted by</p>
                    <p className="text-sm font-bold text-[#1C1C1E]">10,000+ Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20">
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
                className="glass-card p-6 flex flex-col items-center text-center group"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {categoryIcons[cat]}
                </span>
                <h3 className="font-['Playfair_Display'] text-sm font-semibold text-[#1C1C1E] group-hover:text-[#C8963E] transition-colors">
                  {cat}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div key={feat.title} className="glass-card p-6 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-[#C8963E]/10 flex items-center justify-center shrink-0">
                  <feat.icon className="w-5 h-5 text-[#C8963E]" />
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-base font-semibold text-[#1C1C1E] mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-[#6B6B70] leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Our most loved accessories</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#C8963E] hover:text-[#B8872E] transition-colors"
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

      {/* CTA Banner */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1C1C1E] via-[#2A2A30] to-[#1C1C1E] p-10 md:p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8963E]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8BA888]/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 font-['Playfair_Display']">
                Need Help Choosing?
              </h2>
              <p className="text-[#A0A0A5] max-w-md mx-auto mb-8">
                Our team is here to help you find the perfect accessory for your device. Reach out anytime.
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
