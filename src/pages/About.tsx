import { Heart, Target, Star, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="section-title mb-3">About Accessories By CJ</h1>
          <p className="text-xl text-[#475569] italic" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            "Quality accessories for the modern lifestyle"
          </p>
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-2xl font-semibold text-[#0F1629] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Our Story
            </h2>
            <div className="space-y-4 text-[#475569] leading-relaxed">
              <p>
                Accessories By CJ was born from a simple observation: finding premium-quality mobile
                accessories in Pakistan was harder than it should be. We saw a market flooded with
                low-quality products that failed within weeks — and we knew we could do better.
              </p>
              <p>
                Based in the heart of Lahore, we've grown from a small operation into one of the
                most trusted names in mobile accessories across Pakistan. Every product in our
                catalog is personally tested and approved by our team before it reaches you.
              </p>
              <p>
                We believe your devices deserve the best. Whether it's a charger that delivers
                reliable fast charging, a case that actually protects, or earbuds that sound
                incredible — we source and deliver accessories we'd use ourselves.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, title: "Our Mission", desc: "To make premium accessories accessible to every Pakistani" },
              { icon: Heart, title: "Our Promise", desc: "Every product backed by our warranty and quality guarantee" },
              { icon: Star, title: "Quality First", desc: "We never compromise on the quality of our products" },
              { icon: Award, title: "Trusted", desc: "Serving happy customers across Pakistan" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-5 border border-blue-100 shadow-[0_4px_16px_rgba(26,86,219,0.05)] hover:shadow-[0_8px_24px_rgba(26,86,219,0.1)] hover:-translate-y-0.5 transition-all duration-300">
                <item.icon className="w-6 h-6 text-[#1A56DB] mb-3" />
                <h3 className="text-sm font-semibold text-[#0F1629] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-[#0F1629] to-[#1A2744] rounded-[2rem] p-8 md:p-12 text-center">
          <h2 className="text-2xl font-semibold text-white mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Why Choose Accessories By CJ?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { number: "100%", label: "Quality Tested" },
              { number: "24/7", label: "WhatsApp Support" },
              { number: "Pakistan", label: "Nationwide Delivery" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-[#60A5FA] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.number}
                </p>
                <p className="text-sm text-[#94A3B8]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
