// src/components/SpecsModal.tsx
// Replace path: Acc-by-Cj/src/components/SpecsModal.tsx  (NEW FILE)
// Design's specs modal — motion/react replaced with CSS transitions

import React, { useState, useEffect } from "react";
import { X, Shield, Check, Zap, Sparkles } from "lucide-react";
import { getProductVisualById } from "@/components/ProductVisuals";

interface ProductSpec {
  label: string;
  value: string;
}

interface ModalProduct {
  id: string;
  name: string;
  category: string;
  price?: string | number;
  tagline?: string;
  description?: string;
  specs?: ProductSpec[];
  technology?: string;
  rating?: string | number;
}

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ModalProduct | null;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose, product }) => {
  const [visible, setVisible] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedColor, setSelectedColor] = useState("Cosmic Graphite");

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!product && !isOpen) return null;
  if (!product) return null;

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsReserved(true);
      setTimeout(() => setEmail(""), 5000);
    }
  };

  const handleModalClose = () => {
    setIsReserved(false);
    onClose();
  };

  const displayPrice = product.price
    ? (typeof product.price === "number" ? `Rs. ${product.price.toLocaleString()}` : product.price)
    : null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
        onClick={handleModalClose}
      />

      {/* Modal Box */}
      <div
        className={`relative w-full max-w-4xl bg-slate-950/90 border border-blue-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.25)] flex flex-col md:flex-row z-10 max-h-[90vh] overflow-y-auto md:overflow-visible transition-all duration-300 ${visible ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-8 opacity-0"}`}
      >
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT — Product Visual */}
        <div className="relative w-full md:w-1/2 bg-gradient-to-br from-[#0c1a30] to-[#030814] p-8 flex flex-col items-center justify-center min-h-[300px] md:min-h-[500px] border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none blur-2xl" style={{ background: "radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 70%)" }} />
          <div className="absolute w-44 h-44 rounded-full border border-blue-500/10 animate-spin-slow pointer-events-none" />
          <div className="absolute w-64 h-64 rounded-full border border-dashed border-blue-500/5 animate-spin-reverse pointer-events-none" />

          <div className="transform scale-110 lg:scale-125 select-none relative z-10 flex justify-center items-center animate-logo-float">
            {getProductVisualById(product.id)}
          </div>

          <div className="absolute bottom-4 text-center z-10 space-y-1">
            {product.technology && (
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-mono font-bold block">
                {product.technology}
              </span>
            )}
            <p className="text-xs text-white/50">Premium build quality — tested & certified</p>
          </div>
        </div>

        {/* RIGHT — Details & Purchase */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-slate-950 text-white overflow-y-auto">
          <div className="space-y-6">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-400/20">
                {product.category}
              </span>
              {product.rating && (
                <div className="flex items-center gap-1 text-xs text-blue-300">
                  <span className="font-bold">★ {product.rating}</span>
                  <span className="text-white/40">(Verified)</span>
                </div>
              )}
            </div>

            {/* Title & Tagline */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                {product.name}
              </h3>
              {product.tagline && (
                <p className="text-sm text-blue-200/90 font-medium">{product.tagline}</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-white/70 leading-relaxed font-light">
                {product.description}
              </p>
            )}

            {/* Specs Table */}
            {product.specs && product.specs.length > 0 && (
              <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 font-mono">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-1 gap-2.5 text-xs">
                  {product.specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center py-0.5">
                      <span className="text-white/50">{spec.label}</span>
                      <span className="text-white font-medium text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            <div className="space-y-2">
              <span className="text-xs text-white/40 uppercase tracking-wider block font-mono">Select Finish</span>
              <div className="flex gap-3 flex-wrap">
                {["Cosmic Graphite", "Electric Cyan", "Obsidian Black"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedColor === color
                        ? "bg-blue-500/10 border-blue-400 text-white"
                        : "bg-transparent border-white/10 text-white/60 hover:border-white/30"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Panel */}
          <div className="mt-8 border-t border-white/10 pt-6 space-y-4">
            {displayPrice && (
              <div className="flex justify-between items-baseline">
                <span className="text-white/50 text-sm">Price</span>
                <span className="text-3xl font-extrabold text-white">{displayPrice}</span>
              </div>
            )}

            {!isReserved ? (
              <form onSubmit={handleReserveSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for priority checkout"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm uppercase px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center justify-center gap-1"
                  >
                    <Zap className="w-4 h-4" />
                    ORDER NOW
                  </button>
                </div>
                <p className="text-[10px] text-white/40 text-center flex items-center justify-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  Priority queue — no deposit required.
                </p>
              </form>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <h5 className="font-bold text-white text-sm">ORDER CONFIRMED!</h5>
                <p className="text-xs text-white/70 max-w-sm mx-auto">
                  We'll contact you at <span className="text-blue-400">{email || "your email"}</span> with order details shortly.
                </p>
              </div>
            )}

            {/* Fallback WhatsApp CTA */}
            <a
              href="https://wa.me/923120141004"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-medium text-sm py-2.5 rounded-xl transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Order via WhatsApp Instead
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecsModal;
