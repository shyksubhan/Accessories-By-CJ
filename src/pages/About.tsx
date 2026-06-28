import { Heart, Target, Star, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="section-title mb-3">About Accessories By CJ</h1>
          <p className="text-xl text-[#6B6B70] font-['Playfair_Display'] italic">
            "Quality accessories for the modern lifestyle"
          </p>
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-2xl font-semibold text-[#1C1C1E] mb-4 font-['Playfair_Display']">
              Our Story
            </h2>
            <div className="space-y-4 text-[#6B6B70] leading-relaxed">
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
              { icon: Heart, title: "Our Promise", desc: "Every product backed by our 1-year warranty guarantee" },
              { icon: Star, title: "Quality First", desc: "We never compromise on the quality of our products" },
              { icon: Award, title: "Trusted", desc: "Serving 10,000+ happy customers across Pakistan" },
            ].map((item) => (
              <div key={item.title} className="glass-card p-5">
                <item.icon className="w-6 h-6 text-[#C8963E] mb-3" />
                <h3 className="font-['Playfair_Display'] text-sm font-semibold text-[#1C1C1E] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6B6B70] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="glass rounded-[2rem] p-8 md:p-12 text-center">
          <h2 className="text-2xl font-semibold text-[#1C1C1E] mb-8 font-['Playfair_Display']">
            Why Choose Accessories By CJ?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { number: "10K+", label: "Happy Customers" },
              { number: "100%", label: "Quality Tested" },
              { number: "24/7", label: "WhatsApp Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-[#C8963E] mb-1">{stat.number}</p>
                <p className="text-sm text-[#6B6B70]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
