import { Truck, Clock, MapPin, ShieldCheck, Package } from "lucide-react";

const policies = [
  {
    icon: Truck,
    title: "Delivery Time",
    items: [
      "Lahore: 1-2 business days",
      "Other major cities (Karachi, Islamabad, Rawalpindi): 2-3 business days",
      "Rest of Pakistan: 3-5 business days",
    ],
  },
  {
    icon: Package,
    title: "Shipping Charges",
    items: [
      "Free shipping on orders above Rs. 3,000",
      "Flat Rs. 250 shipping for orders below Rs. 3,000",
      "Cash on Delivery available across Pakistan",
    ],
  },
  {
    icon: MapPin,
    title: "Delivery Partners",
    items: [
      "We use trusted courier services including TCS, Leopards, and M&P",
      "Tracking number provided via WhatsApp once your order ships",
      "We deliver to all major cities across Pakistan",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Order Processing",
    items: [
      "Orders placed before 2 PM are processed the same day",
      "Orders placed after 2 PM are processed the next business day",
      "Weekend orders are processed on Monday",
    ],
  },
  {
    icon: Clock,
    title: "Returns & Exchanges",
    items: [
      "7-day return policy from the date of delivery",
      "Product must be unused and in original packaging",
      "Contact us on WhatsApp to initiate a return or exchange",
      "Refund processed within 5-7 business days after inspection",
    ],
  },
];

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title mb-2">Shipping Policy</h1>
          <p className="section-subtitle">Everything you need to know about delivery and returns</p>
        </div>

        <div className="space-y-6">
          {policies.map((policy) => (
            <div key={policy.title} className="glass-card p-6 md:p-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C8963E]/10 flex items-center justify-center shrink-0">
                  <policy.icon className="w-5 h-5 text-[#C8963E]" />
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-3">
                    {policy.title}
                  </h3>
                  <ul className="space-y-2">
                    {policy.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-[#4A4A50]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8BA888] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-10 glass rounded-2xl p-6 text-center">
          <p className="text-sm text-[#6B6B70]">
            For any shipping-related queries, reach us on{" "}
            <a
              href="https://wa.me/923120141004"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C8963E] font-medium hover:underline"
            >
              WhatsApp at 0312 0141004
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
