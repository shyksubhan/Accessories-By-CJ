import { useState } from "react";
import { Shield, Truck, RefreshCw, Lock, CreditCard, ChevronDown, ChevronUp } from "lucide-react";

interface PolicySection {
  id: string;
  icon: React.ElementType;
  title: string;
  color: string;
  bg: string;
  content: { heading?: string; points: string[] }[];
}

const policies: PolicySection[] = [
  {
    id: "warranty",
    icon: Shield,
    title: "Warranty Policy",
    color: "text-[#1A56DB]",
    bg: "bg-[#EFF6FF]",
    content: [
      {
        heading: "Coverage Duration",
        points: [
          "All sealed accessories come with a 3-Months warranty from the date of purchase.",
        ],
      },
      {
        heading: "What is Covered",
        points: [
          "Manufacturing defects only.",
        ],
      },
      {
        heading: "What is NOT Covered",
        points: [
          "Physical damage",
          "Water damage",
          "Misuse or improper handling",
          "Electrical surges",
          "Wear and tear from regular use",
          "Unauthorized repairs or modifications",
        ],
      },
      {
        heading: "Claim Process",
        points: [
          "All warranty claims are subject to inspection at our end.",
          "Approval or rejection of a claim will be based solely on our technical assessment.",
          "Proof of purchase is mandatory for all warranty claims.",
          "Without valid proof, warranty service will not be entertained.",
        ],
      },
    ],
  },
  {
    id: "shipping",
    icon: Truck,
    title: "Shipping Policy",
    color: "text-[#0369a1]",
    bg: "bg-[#F0F9FF]",
    content: [
      {
        heading: "Delivery Timeframes",
        points: [
          "Lahore: 1–2 business days",
          "Karachi, Islamabad, Rawalpindi: 2–3 business days",
          "Rest of Pakistan: 3–5 business days",
        ],
      },
      {
        heading: "Shipping Charges",
        points: [
          "Free shipping on orders above Rs. 3,000",
          "Flat Rs. 250 for orders below Rs. 3,000",
          "Cash on Delivery (COD) available across Pakistan",
        ],
      },
    ],
  },
  {
    id: "returns",
    icon: RefreshCw,
    title: "Return & Exchange Policy",
    color: "text-[#16a34a]",
    bg: "bg-[#F0FDF4]",
    content: [
      {
        heading: "Return Window",
        points: [
          "7-day return policy from the date of delivery.",
          "Product must be unused and in original packaging with all accessories.",
        ],
      },
      {
        heading: "How to Return",
        points: [
          "Contact us on WhatsApp at 0312 0141004 to initiate a return or exchange.",
          "Provide your order number and reason for return.",
          "Refund processed within 5–7 business days after inspection.",
        ],
      },
      {
        heading: "Non-Returnable Items",
        points: [
          "Items damaged due to misuse or mishandling",
          "Products without original packaging",
          "Items returned after 7 days of delivery",
        ],
      },
    ],
  },
  {
    id: "privacy",
    icon: Lock,
    title: "Privacy Policy",
    color: "text-[#7c3aed]",
    bg: "bg-[#F5F3FF]",
    content: [
      {
        heading: "Data We Collect",
        points: [
          "Name, phone number, and email address provided during checkout or contact.",
          "Delivery address for order fulfillment.",
          "WhatsApp communication history for support purposes.",
        ],
      },
      {
        heading: "How We Use Your Data",
        points: [
          "To process and deliver your orders.",
          "To provide customer support and respond to queries.",
          "To send order updates and tracking information via WhatsApp.",
        ],
      },
      {
        heading: "Data Protection",
        points: [
          "We do not sell or share your personal information with third parties.",
          "Your data is used solely for order fulfillment and customer support.",
          "You may request deletion of your data by contacting us directly.",
        ],
      },
    ],
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Payment Policy",
    color: "text-[#d97706]",
    bg: "bg-[#FFFBEB]",
    content: [
      {
        heading: "Accepted Payment Methods",
        points: [
          "Cash on Delivery (COD) — available nationwide",
          "Bank Transfer (Meezan Bank, HBL, UBL)",
          "JazzCash / EasyPaisa mobile wallets",
        ],
      },
      {
        heading: "Payment Terms",
        points: [
          "COD payment is collected at the time of delivery.",
          "Bank transfers must be completed before order dispatch.",
          "Payment screenshots to be shared on WhatsApp for confirmation.",
          "Orders are confirmed on WhatsApp before dispatch.",
        ],
      },
    ],
  },
];

function PolicyCard({ policy }: { policy: PolicySection }) {
  const [open, setOpen] = useState(false);
  const Icon = policy.icon;

  return (
    <div className={`rounded-2xl border border-white/80 overflow-hidden shadow-[0_4px_20px_rgba(26,86,219,0.06)] transition-all duration-300`}>
      <button
        className={`w-full flex items-center justify-between p-6 ${policy.bg} hover:opacity-90 transition-opacity`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Icon className={`w-6 h-6 ${policy.color}`} />
          </div>
          <h2
            className="text-lg font-semibold text-[#0F1629]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {policy.title}
          </h2>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-[#64748B]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#64748B]" />
        )}
      </button>

      {open && (
        <div className="bg-white p-6 space-y-6">
          {policy.content.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h3
                  className="text-sm font-semibold text-[#0F1629] mb-2 uppercase tracking-wide"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {section.heading}
                </h3>
              )}
              <ul className="space-y-2">
                {section.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-[#475569]">
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${policy.color.replace("text-", "bg-")}`} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StorePolicies() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title mb-2">Store Policies</h1>
          <p className="section-subtitle">
            All our policies in one place — transparent, fair, and customer-first.
          </p>
        </div>

        {/* Policy Accordion Cards */}
        <div className="space-y-4">
          {policies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-10 bg-[#EFF6FF] rounded-2xl p-6 text-center border border-blue-100">
          <p className="text-sm text-[#475569]">
            Have questions about our policies?{" "}
            <a
              href="https://wa.me/923120141004"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A56DB] font-medium hover:underline"
            >
              Chat with us on WhatsApp
            </a>{" "}
            or{" "}
            <a href="mailto:accesoriesbycj@gmail.com" className="text-[#1A56DB] font-medium hover:underline">
              email us
            </a>.
          </p>
          <p className="text-xs text-[#94A3B8] mt-2">Last updated: June 2026</p>
        </div>
      </div>
    </div>
  );
}
