// src/pages/Home.tsx
// Replace path: Acc-by-Cj/src/pages/Home.tsx
// Updated: hero right column now uses CjLogoSVG + ProductVisuals from design

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Shield, Truck, RefreshCw, Headphones, Zap, Star, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { productsApi, type ApiProduct } from "@/lib/api";
import { CjLogoSVG } from "@/components/CjLogo";
import {
  PowerBankVisual,
  ChargerVisual,
  BraidedCableVisual,
  ChargingPadVisual,
} from "@/components/ProductVisuals";
import { SpecsModal } from "@/components/SpecsModal";

/* ─── Category data ─── */
const CATS = [
  { label: "Chargers",    emoji: "⚡", desc: "Fast & GaN charging" },
  { label: "Cables",      emoji: "🔗", desc: "Durable braided cables" },
  { label: "Power Banks", emoji: "🔋", desc: "Power on the go" },
  { label: "Earbuds",     emoji: "🎧", desc: "Crystal clear sound" },
  { label: "Cases",       emoji: "📱", desc: "Ultimate protection" },
];

/* ─── Counter animation hook ─── */
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setCount(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { count, ref };
}

function StatNumber({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-white/60 mt-1">{label}</p>
    </div>
  );
}

/* ─── Showcase product mini-tiles ─── */
const showcaseItems = [
  { id: "power-bank",    label: "Power Bank",  Visual: PowerBankVisual,   pos: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20" },
  { id: "gan-charger",   label: "GaN Charger", Visual: ChargerVisual,     pos: "absolute top-4 right-8 z-10" },
  { id: "braided-cable", label: "Cable",       Visual: BraidedCableVisual, pos: "absolute bottom-4 right-4 z-10" },
  { id: "charging-pad",  label: "Wireless Pad",Visual: ChargingPadVisual, pos: "absolute bottom-6 left-4 z-10" },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ApiProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeShowcase, setActiveShowcase] = useState("power-bank");
  const [specsOpen, setSpecsOpen] = useState(false);

  useEffect(() => {
    productsApi.getAll()
      .then((all) => setFeaturedProducts(all.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  // Auto-rotate showcase
  useEffect(() => {
    const ids = showcaseItems.map(s => s.id);
    const interval = setInterval(() => {
      setActiveShowcase(prev => {
        const idx = ids.indexOf(prev);
        return ids[(idx + 1) % ids.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeProduct = showcaseItems.find(s => s.id === activeShowcase);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ══════════════════════════════════════════════
          HERO — Cinematic Dark Layout
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center bg-[#020817]">
        {/* Mesh gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-60"
            style={{ background: "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(26,86,219,0.35) 0%, transparent 70%)" }}
          />
          <div className="absolute top-0 right-0 w-full h-full opacity-40"
            style={{ background: "radial-gradient(ellipse 60% 50% at 80% 70%, rgba(59,130,246,0.2) 0%, transparent 70%)" }}
          />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Floating ambient particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400/20 animate-particle"
              style={{
                left: `${(i * 37 + 11) % 100}%`,
                top: `${(i * 53 + 7) % 100}%`,
                width: `${2 + (i % 4)}px`,
                height: `${2 + (i % 4)}px`,
                animationDelay: `${i * 200}ms`,
                animationDuration: `${5 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — Text */}
            <div>
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse" />
                <span className="text-xs font-semibold text-white/80 tracking-widest uppercase"
                  style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Style Meets Performance
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Premium
                <span className="block bg-gradient-to-r from-[#60A5FA] via-[#818CF8] to-[#60A5FA] bg-clip-text text-transparent">
                  Accessories
                </span>
                <span className="block text-white">by CJ</span>
              </h1>

              <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Elevate your device with chargers, cables, power banks, earbuds & cases — built to perform,
                designed to impress.
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link to="/products"
                  className="inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#1345b8] text-white font-semibold px-7 py-3.5 rounded-xl shadow-[0_8px_24px_rgba(26,86,219,0.45)] hover:shadow-[0_12px_32px_rgba(26,86,219,0.55)] transition-all duration-300 hover:-translate-y-0.5"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/about"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-300 backdrop-blur"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Our Story
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex gap-6 mt-10">
                {[
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: Shield, label: "3M Warranty" },
                  { icon: RefreshCw, label: "7-Day Returns" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2">
                    <t.icon className="w-4 h-4 text-[#60A5FA]" />
                    <span className="text-xs text-white/60" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right — Cinematic Product Showcase (from Design) ── */}
            <div className="relative flex items-center justify-center h-[420px] sm:h-[480px]">

              {/* Ambient glow orb */}
              <div className="absolute w-72 h-72 rounded-full bg-blue-600/10 blur-3xl animate-pulse-glow pointer-events-none" />

              {/* Energy rotation rings */}
              <div className="absolute w-[340px] h-[340px] rounded-full border border-dashed border-blue-500/20 animate-energy-rotate-slow pointer-events-none" />
              <div className="absolute w-[290px] h-[290px] rounded-full border border-double border-blue-400/10 animate-energy-rotate-fast pointer-events-none" />
              <div className="absolute w-64 h-64 rounded-full border-2 border-dashed border-[#1A56DB]/25 animate-spin-slow pointer-events-none" />
              <div className="absolute w-52 h-52 rounded-full border border-[#60A5FA]/15 animate-spin-reverse pointer-events-none" />

              {/* ── CENTER: CjLogoSVG (replaces old img logo) ── */}
              <div className="relative z-10 flex flex-col items-center justify-center animate-logo-float">
                <div className="w-44 h-44 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
                  <CjLogoSVG size={120} glow={true} />
                </div>
                <span className="mt-3 font-podium text-white/60 text-[10px] tracking-[0.3em] uppercase select-none">
                  AUTHENTIC SEAL
                </span>
              </div>

              {/* ── Floating product SVG visuals from design ── */}
              {/* Top-right: Charger */}
              <div
                className="absolute top-6 right-6 z-20 cursor-pointer animate-float-1 opacity-80 hover:opacity-100 transition-opacity"
                onClick={() => setActiveShowcase("gan-charger")}
              >
                <div className={`p-1 rounded-xl transition-all duration-300 ${activeShowcase === "gan-charger" ? "ring-1 ring-blue-400/50 bg-blue-500/10" : ""}`}>
                  <ChargerVisual />
                </div>
              </div>

              {/* Bottom-right: Cable */}
              <div
                className="absolute bottom-2 right-2 z-20 cursor-pointer animate-float-2 opacity-70 hover:opacity-100 transition-opacity"
                onClick={() => setActiveShowcase("braided-cable")}
              >
                <div className={`p-1 rounded-xl transition-all duration-300 ${activeShowcase === "braided-cable" ? "ring-1 ring-blue-400/50 bg-blue-500/10" : ""}`}>
                  <BraidedCableVisual />
                </div>
              </div>

              {/* Bottom-left: Wireless Pad */}
              <div
                className="absolute bottom-4 left-2 z-20 cursor-pointer animate-float-1 opacity-70 hover:opacity-100 transition-opacity"
                style={{ animationDelay: "0.8s" }}
                onClick={() => setActiveShowcase("charging-pad")}
              >
                <div className={`p-1 rounded-xl transition-all duration-300 ${activeShowcase === "charging-pad" ? "ring-1 ring-blue-400/50 bg-blue-500/10" : ""}`}>
                  <ChargingPadVisual />
                </div>
              </div>

              {/* Active product info HUD card */}
              {activeProduct && (
                <div className="absolute left-0 top-4 z-30 max-w-[180px] bg-slate-950/80 border border-blue-500/30 rounded-2xl p-3 shadow-2xl backdrop-blur-md">
                  <span className="text-[8px] uppercase tracking-widest text-blue-400 font-mono font-bold block mb-1">
                    {activeProduct.label}
                  </span>
                  <button
                    onClick={() => setSpecsOpen(true)}
                    className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-400/30 py-1 rounded-lg text-[9px] uppercase font-mono tracking-widest transition-all flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    View Specs
                  </button>
                </div>
              )}

              {/* Trust badge (lg only) */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-xl whitespace-nowrap">
                <div className="w-8 h-8 rounded-xl bg-[#1A56DB] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">GaN V Technology</p>
                  <p className="text-[10px] text-white/50">Next-Gen Fast Charging</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#0F1629] via-[#1A2744] to-[#0F1629] py-14">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <StatNumber value={500}  suffix="+" label="Happy Customers" />
          <StatNumber value={100}  suffix="%"  label="Quality Tested" />
          <StatNumber value={3}    suffix=" Mo" label="Warranty Coverage" />
          <StatNumber value={7}    suffix=" Day" label="Easy Returns" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#1A56DB] tracking-widest uppercase mb-3"
              style={{ fontFamily: "'Outfit', sans-serif" }}>
              Browse
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1629]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Shop by Category
            </h2>
            <p className="text-[#64748B] mt-3 max-w-md mx-auto">
              Find the perfect accessory for every need
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATS.map((cat, i) => (
              <Link
                key={cat.label}
                to={`/products?category=${encodeURIComponent(cat.label)}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-blue-100 p-6 flex flex-col items-center text-center hover:shadow-[0_16px_40px_rgba(26,86,219,0.12)] hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#EFF6FF] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] group-hover:bg-[#1A56DB] flex items-center justify-center mb-4 transition-colors duration-300 shadow-sm">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {cat.emoji}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#0F1629] group-hover:text-[#1A56DB] transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {cat.label}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">{cat.desc}</p>
                </div>
                <ChevronRight className="relative z-10 w-4 h-4 text-[#BFDBFE] group-hover:text-[#1A56DB] mt-3 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-[#EFF6FF]/60 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold text-[#1A56DB] tracking-widest uppercase mb-3"
                style={{ fontFamily: "'Outfit', sans-serif" }}>
                Products
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F1629]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Featured Products
              </h2>
              <p className="text-[#64748B] mt-2">Handpicked accessories, loved by customers</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A56DB] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-4 py-2 rounded-xl transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-blue-100">
              <span className="text-6xl mb-4 block">🛍️</span>
              <h3 className="text-xl font-semibold text-[#0F1629] mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Products Coming Soon
              </h3>
              <p className="text-[#64748B] max-w-sm mx-auto mb-6">
                We're stocking up our store with premium accessories. Chat with us on WhatsApp in the meantime.
              </p>
              <a
                href="https://wa.me/923120141004"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-medium hover:-translate-y-0.5 transition-all duration-300 shadow-[0_4px_12px_rgba(37,211,102,0.3)]"
              >
                Chat on WhatsApp
              </a>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A56DB] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-5 py-2.5 rounded-xl transition-colors">
              View All Products <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY CHOOSE US — Bento Grid
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#1A56DB] tracking-widest uppercase mb-3"
              style={{ fontFamily: "'Outfit', sans-serif" }}>
              Why Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1629]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              The CJ Advantage
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "⚡",
                title: "Fast Nationwide Delivery",
                desc: "Lahore: 1–2 days. Rest of Pakistan: 2–5 days.",
                color: "from-[#EFF6FF] to-[#DBEAFE]",
              },
              {
                icon: "🛡️",
                title: "3-Month Warranty",
                desc: "All sealed accessories covered for manufacturing defects.",
                color: "from-[#F0FDF4] to-[#DCFCE7]",
              },
              {
                icon: "↩️",
                title: "7-Day Easy Returns",
                desc: "Not happy? Return it hassle-free within 7 days.",
                color: "from-[#FFF7ED] to-[#FED7AA]",
              },
              {
                icon: "💬",
                title: "WhatsApp Support",
                desc: "Real humans, real answers — chat us anytime.",
                color: "from-[#F5F3FF] to-[#EDE9FE]",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 border border-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <span className="text-4xl mb-4 block">{card.icon}</span>
                <h3 className="text-base font-semibold text-[#0F1629] mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {card.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-[#EFF6FF]/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#020817] via-[#0F1629] to-[#1A2744] text-center px-8 py-16">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#1A56DB]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#3B82F6]/15 rounded-full blur-3xl" />
            {[...Array(6)].map((_, i) => (
              <div key={i}
                className="absolute w-1 h-1 rounded-full bg-white/40 animate-pulse"
                style={{ top: `${15 + i * 12}%`, left: `${8 + i * 14}%`, animationDelay: `${i * 0.3}s` }}
              />
            ))}
            <div className="relative z-10">
              <p className="text-xs font-semibold text-[#60A5FA] tracking-widest uppercase mb-3"
                style={{ fontFamily: "'Outfit', sans-serif" }}>
                Get In Touch
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Need Help Choosing<br />the Right Accessory?
              </h2>
              <p className="text-white/50 max-w-sm mx-auto mb-8 leading-relaxed">
                Our team is always here to guide you to the perfect product for your device.
              </p>
              <a
                href="https://wa.me/923120141004"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ea855] text-white font-semibold px-8 py-4 rounded-xl shadow-[0_8px_28px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_36px_rgba(37,211,102,0.45)] transition-all duration-300 hover:-translate-y-0.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Specs Modal (triggered by hero HUD) */}
      <SpecsModal
        isOpen={specsOpen}
        onClose={() => setSpecsOpen(false)}
        product={
          activeShowcase === "gan-charger"
            ? { id: "gan-charger", name: "GaN Charger", category: "Wall Charger", technology: "GaN V Fast-Charging Engine" }
            : activeShowcase === "braided-cable"
            ? { id: "braided-cable", name: "Braided Cable", category: "Cables", technology: "240W Super Duplex Kevlar" }
            : activeShowcase === "charging-pad"
            ? { id: "charging-pad", name: "Wireless Pad", category: "Wireless Charging", technology: "Qi2 AuraCool" }
            : { id: "power-bank", name: "Power Bank", category: "Power Banks", technology: "140W GaN ActiveShield" }
        }
      />
    </div>
  );
}
