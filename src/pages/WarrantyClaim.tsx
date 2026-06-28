import { useState, useRef, type FormEvent } from "react";
import { ShieldAlert, Upload, Send, Check, FileText, X } from "lucide-react";
import { warrantyApi } from "@/lib/api";

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
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-[#8BA888]/15 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#5B8C5A]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1C1C1E] mb-2 font-['Playfair_Display']">Claim Submitted!</h2>
          <p className="text-[#6B6B70] mb-2">
            Your warranty claim has been registered. Our team will contact you on WhatsApp within 24 hours.
          </p>
          <p className="text-sm text-[#A0A0A5]">
            Claim Reference: <strong className="text-[#1C1C1E]">#{claimNumber}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#C8963E]/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-[#C8963E]" />
          </div>
          <h1 className="section-title mb-2">Warranty Claim</h1>
          <p className="section-subtitle">All products come with a 1-year warranty. Fill out the form below to file a claim.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {/* Customer Info */}
          <div>
            <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-4">Your Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Full Name *</label>
                <input name="fullName" type="text" required value={form.fullName} onChange={handleChange}
                  className="premium-input" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Phone Number *</label>
                <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
                  className="premium-input" placeholder="03XX XXXXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className="premium-input" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Order Number (if available)</label>
                <input name="orderNumber" type="text" value={form.orderNumber} onChange={handleChange}
                  className="premium-input" placeholder="#CJ12345" />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-4">Product Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Product Name *</label>
                <input name="productName" type="text" required value={form.productName} onChange={handleChange}
                  className="premium-input" placeholder="e.g., GaN Fast Charger 65W" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Category *</label>
                <select name="category" required value={form.category} onChange={handleChange}
                  className="premium-input cursor-pointer">
                  <option value="">Select category</option>
                  {["Chargers", "Cables", "Power Banks", "Earbuds", "Cases"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Purchase Date (approx) *</label>
                <input name="purchaseDate" type="date" required value={form.purchaseDate} onChange={handleChange}
                  className="premium-input" />
              </div>
            </div>
          </div>

          {/* Issue */}
          <div>
            <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-4">Issue Description</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">What's the problem? *</label>
                <textarea name="issueDesc" required value={form.issueDesc} onChange={handleChange}
                  className="premium-textarea"
                  placeholder="Please describe the issue in detail. What happened? When did it start? What were you doing when the issue occurred?" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Upload Photo (optional)</label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-[#E5E0D5]" />
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
                    className="border-2 border-dashed border-[#E5E0D5] rounded-xl p-6 text-center hover:border-[#C8963E]/40 transition-colors cursor-pointer"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-[#A0A0A5] mx-auto mb-2" />
                    <p className="text-sm text-[#A0A0A5]">Drop photos here or click to browse</p>
                    <p className="text-xs text-[#D4C9B5] mt-1">PNG, JPG up to 5MB</p>
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

          <p className="text-xs text-[#A0A0A5] text-center">
            By submitting, you agree that our team may contact you regarding this claim. Response time: within 24 hours.
          </p>
        </form>

        {/* Warranty Info */}
        <div className="mt-8 glass rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-[#C8963E] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-['Playfair_Display'] text-base font-semibold text-[#1C1C1E] mb-2">What's Covered?</h3>
              <ul className="space-y-1.5 text-sm text-[#6B6B70]">
                <li>• Manufacturing defects and workmanship issues</li>
                <li>• Charging port failures and cable fraying (not from misuse)</li>
                <li>• Battery degradation beyond normal wear for power banks</li>
                <li>• Speaker/mic failure in earbuds under normal use</li>
                <li className="text-[#A0A0A5] mt-2">Not covered: Physical damage, water damage, lost items, unauthorized repairs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
