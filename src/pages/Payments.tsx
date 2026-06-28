import { CreditCard, Wallet, Banknote, ShieldCheck } from "lucide-react";

const methods = [
  {
    icon: Banknote,
    title: "Cash on Delivery",
    desc: "Pay when your order arrives at your doorstep. Available across Pakistan.",
    details: ["No advance payment required", "Inspect before paying", "Available nationwide"],
  },
  {
    icon: Wallet,
    title: "Bank Transfer",
    desc: "Direct bank transfer to our account. Share the receipt on WhatsApp for quick processing.",
    details: ["Instant confirmation", "All major banks supported", "Secure transaction"],
  },
  {
    icon: CreditCard,
    title: "EasyPaisa / JazzCash",
    desc: "Send payment via EasyPaisa or JazzCash mobile wallets. Fast and convenient.",
    details: ["Real-time processing", "Mobile wallet convenience", "24/7 availability"],
  },
];

export default function Payments() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="section-title mb-2">Payment Methods</h1>
          <p className="section-subtitle">Choose the payment option that works best for you</p>
        </div>

        {/* Methods */}
        <div className="space-y-6 mb-12">
          {methods.map((method) => (
            <div key={method.title} className="glass-card p-6 md:p-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C8963E]/10 flex items-center justify-center shrink-0">
                  <method.icon className="w-5 h-5 text-[#C8963E]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#1C1C1E] mb-2">
                    {method.title}
                  </h3>
                  <p className="text-[#6B6B70] leading-relaxed mb-4">{method.desc}</p>
                  <ul className="space-y-2">
                    {method.details.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm text-[#4A4A50]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8BA888]" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Note */}
        <div className="glass rounded-2xl p-6 text-center">
          <ShieldCheck className="w-8 h-8 text-[#8BA888] mx-auto mb-3" />
          <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-2">
            Secure Transactions
          </h3>
          <p className="text-sm text-[#6B6B70] max-w-md mx-auto">
            All transactions are handled with care. We never store your financial information.
            For any payment-related questions, reach us on WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
