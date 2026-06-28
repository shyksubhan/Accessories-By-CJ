import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20">
      {/* WhatsApp Floating Button — bottom RIGHT, slightly above bottom */}
      <a
        href="https://wa.me/923120141004"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.5)] hover:scale-110 transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute right-full mr-3 bg-[#0F1629] text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us
        </span>
      </a>

      {/* Main Footer */}
      <div className="bg-gradient-to-b from-[#EFF6FF] to-[#DBEAFE]/60 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-5">
                <img
                  src="/logo.png"
                  alt="Accessories By CJ"
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <p className="text-sm text-[#475569] leading-relaxed mb-6">
                Premium mobile accessories crafted for those who demand the best. Quality you can feel, performance you can trust.
              </p>
              {/* Social Icons — Instagram & Facebook only, real logos, bigger */}
              <div className="flex gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/accessoriesbycj_official?igsh=aG5zeW94NXNidTM5&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white border border-blue-100 flex items-center justify-center hover:shadow-[0_4px_16px_rgba(26,86,219,0.15)] hover:-translate-y-0.5 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f09433" />
                        <stop offset="25%" stopColor="#e6683c" />
                        <stop offset="50%" stopColor="#dc2743" />
                        <stop offset="75%" stopColor="#cc2366" />
                        <stop offset="100%" stopColor="#bc1888" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad)" />
                    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8" fill="none" />
                    <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1E8Af8qK5c/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white border border-blue-100 flex items-center justify-center hover:shadow-[0_4px_16px_rgba(26,86,219,0.15)] hover:-translate-y-0.5 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="5" fill="#1877F2" />
                    <path d="M16.5 8H14.5C13.9477 8 13.5 8.44772 13.5 9V11H16.5L16 14H13.5V21H10.5V14H8.5V11H10.5V9C10.5 7.067 12.067 5.5 14 5.5H16.5V8Z" fill="white" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-semibold text-[#0F1629] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Home", to: "/" },
                  { label: "All Products", to: "/products" },
                  { label: "About Us", to: "/about" },
                  { label: "Contact Us", to: "/contact" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#475569] hover:text-[#1A56DB] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-base font-semibold text-[#0F1629] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Customer Service
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Shipping Policy", to: "/shipping-policy" },
                  { label: "Payment Methods", to: "/payments" },
                  { label: "Warranty Claim", to: "/warranty-claim" },
                  { label: "Store Policies", to: "/policies" },
                  { label: "My Profile", to: "/profile" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#475569] hover:text-[#1A56DB] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-base font-semibold text-[#0F1629] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Contact Info
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Phone className="w-4 h-4 text-[#1A56DB] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#475569]">0312 0141004</span>
                </li>
                <li className="flex gap-3">
                  <Mail className="w-4 h-4 text-[#1A56DB] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#475569] break-all">
                    accesoriesbycj@gmail.com
                  </span>
                </li>
                <li className="flex gap-3">
                  <MapPin className="w-4 h-4 text-[#1A56DB] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#475569] leading-relaxed">
                    House No 50A, 21 Achar Sacheem, Samanabad, Lahore, 54000, Pakistan
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-blue-100/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#94A3B8]">
              &copy; {new Date().getFullYear()} Accessories By CJ. All rights reserved.
            </p>
            <p className="text-xs text-[#94A3B8]">
              Made with ❤️ in Lahore, Pakistan
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
