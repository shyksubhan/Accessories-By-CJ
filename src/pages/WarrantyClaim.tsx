import { useState, useRef, type FormEvent } from "react";
import { ShieldCheck, Upload, Send, Check, X, AlertTriangle, Info } from "lucide-react";
import { warrantyApi } from "@/lib/api";

const warrantyTerms = [
  {
    icon: ShieldCheck,
    title: "3-Month Warranty Coverage",
    desc: "All sealed accessories come with a 3-Months warranty from the date of purchase.",
    color: "text-[#1A56DB]",
    bg: "bg-[#EFF6FF]",
  },
  {
    icon: Info,
    title: "What's Covered",
    desc: "The warranty covers manufacturing defects only. It does not apply to physical damage, water damage, misuse, electrical surges, wear and tear, or unauthorized repairs/modifications.",
    color: "text-[#0369a1]",
    bg: "bg-[#F0F9FF]",
  },
  {
    icon: AlertTriangle,
    title: "Inspection Required",
    desc: "All warranty claims are subject to inspection at our end. Approval or rejection of a claim will be based solely on our technical assessment.",
    color: "text-[#d97706]",
    bg: "bg-[#FFFBEB]",
  },
  {
    icon: Check,
    title: "Proof of Purchase Mandatory",
    desc: "Proof of purchase is mandatory for all warranty claims. Without valid proof, warranty service will not be entertained.",
    color: "text-[#16a34a]",
    bg: "bg-[#F0FDF4]",
  },
];

export default function WarrantyClaim() {
  const [submitted, setSubmitted] = useState(false);
  const [claimNumber, setClaimNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", orderNumber: "",
    productName: "", category: "", purchaseDate: "", issueDesc: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (imageFile) fd.append("image", imageFile);
      const res = await warrantyApi.submit(fd);
      setClaimNumber(res.claim.claimNumber);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit claim. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-[#DBEAFE] flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#1A56DB]" />
          </div>
          <h2
            className="text-2xl font-bold text-[#0F1629] mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Claim Submitted!
          </h2>
          <p className="text-[#475569] mb-2">
            Your warranty claim has been registered. Our team will contact you on WhatsApp within 24 hours.
          </p>
          <p className="text-sm text-[#94A3B8]">
            Claim Reference: <strong className="text-[#0F1629]">#{claimNumber}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-[#1A56DB]" />
          </div>
          <h1 className="section-title mb-2">Warranty Claim Form</h1>
          <p className="section-subtitle">Submit your claim and our team will review it within 24 hours</p>
        </div>

        {/* Warranty Terms — Unique card grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {warrantyTerms.map((term) => (
            <div
              key={term.title}
              className={`${term.bg} rounded-2xl p-5 border border-white shadow-[0_2px_12px_rgba(26,86,219,0.06)]`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm`}>
                  <term.icon className={`w-4 h-4 ${term.color}`} />
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold text-[#0F1629] mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {term.title}
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{term.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 space-y-6 border border-blue-100 shadow-[0_4px_24px_rgba(26,86,219,0.06)]">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {/* Customer Info */}
          <div>
            <h3
              className="text-lg font-semibold text-[#0F1629] mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Your Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Full Name *</label>
                <input name="fullName" type="text" required value={form.fullName} onChange={handleChange}
                  className="premium-input" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Phone Number *</label>
                <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
                  className="premium-input" placeholder="03XX XXXXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className="premium-input" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Order Number (Proof of Purchase *)</label>
                <input name="orderNumber" type="text" required value={form.orderNumber} onChange={handleChange}
                  className="premium-input" placeholder="#CJ12345" />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h3
              className="text-lg font-semibold text-[#0F1629] mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Product Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Product Name *</label>
                <input name="productName" type="text" required value={form.productName} onChange={handleChange}
                  className="premium-input" placeholder="e.g., GaN Fast Charger 65W" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Category *</label>
                <select name="category" required value={form.category} onChange={handleChange}
                  className="premium-input cursor-pointer">
                  <option value="">Select category</option>
                  {["Chargers", "Cables", "Power Banks", "Earbuds", "Cases"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Purchase Date *</label>
                <input name="purchaseDate" type="date" required value={form.purchaseDate} onChange={handleChange}
                  className="premium-input" />
              </div>
            </div>
          </div>

          {/* Issue */}
          <div>
            <h3
              className="text-lg font-semibold text-[#0F1629] mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Issue Description
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">What's the problem? *</label>
                <textarea name="issueDesc" required value={form.issueDesc} onChange={handleChange}
                  className="premium-textarea"
                  placeholder="Please describe the issue in detail. What happened? When did it start?" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Upload Photo (optional)</label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-blue-100" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(""); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:border-[#1A56DB]/50 transition-colors cursor-pointer bg-[#EFF6FF]/30"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                    <p className="text-sm text-[#94A3B8]">Drop photos here or click to browse</p>
                    <p className="text-xs text-[#CBD5E1] mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              <><Send className="w-4 h-4" /> Submit Warranty Claim</>
            )}
          </button>

          <p className="text-xs text-[#94A3B8] text-center">
            By submitting, you agree that our team may contact you regarding this claim. Response time: within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
