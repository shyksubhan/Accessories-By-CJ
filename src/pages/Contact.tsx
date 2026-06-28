import { useState } from "react";
import { Phone, Mail, MapPin, Send, Clock, MessageCircle } from "lucide-react";
import { contactApi } from "@/lib/api";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await contactApi.submit(form);
      setSent(true);
      setForm({ fullName: "", phone: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title mb-2">Contact Us</h1>
          <p className="section-subtitle">We'd love to hear from you. Reach out anytime.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8">
              <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#1C1C1E] mb-6">
                Send us a message
              </h3>
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Full Name *</label>
                    <input name="fullName" type="text" required value={form.fullName} onChange={handleChange}
                      className="premium-input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Phone Number *</label>
                    <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
                      className="premium-input" placeholder="03XX XXXXXXX" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    className="premium-input" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Subject *</label>
                  <input name="subject" type="text" required value={form.subject} onChange={handleChange}
                    className="premium-input" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A50] mb-1.5">Message *</label>
                  <textarea name="message" required value={form.message} onChange={handleChange}
                    className="premium-textarea" placeholder="Tell us more..." />
                </div>
                <button
                  type="submit"
                  disabled={loading || sent}
                  className={`btn-primary flex items-center gap-2 ${sent ? "bg-[#8BA888]! hover:bg-[#5B8C5A]!" : ""}`}
                >
                  {sent ? (
                    <>Message Sent! ✓</>
                  ) : loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] mb-5">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-[#C8963E] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">Phone</p>
                    <a href="tel:+923120141004" className="text-sm text-[#6B6B70] hover:text-[#C8963E] transition-colors">0312 0141004</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-[#C8963E] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">Email</p>
                    <a href="mailto:accesoriesbycj@gmail.com" className="text-sm text-[#6B6B70] hover:text-[#C8963E] transition-colors break-all">accesoriesbycj@gmail.com</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#C8963E] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">Address</p>
                    <p className="text-sm text-[#6B6B70] leading-relaxed">House No 50A, 21 Achar Sacheem, Samanabad, Lahore, 54000, Pakistan</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-[#C8963E] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">Business Hours</p>
                    <p className="text-sm text-[#6B6B70]">Mon - Sat: 10 AM - 8 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <a href="https://wa.me/923120141004" target="_blank" rel="noopener noreferrer"
              className="glass-card p-5 flex items-center gap-4 bg-[#25D366]/5! border-[#25D366]/20!">
              <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center shadow-[0_4px_12px_rgba(37,211,102,0.3)]">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C1C1E]">Quick Chat on WhatsApp</p>
                <p className="text-xs text-[#6B6B70]">Usually reply within minutes</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
