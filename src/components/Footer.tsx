import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20">
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/923120141004"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.45)] hover:scale-110 transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute left-full ml-3 bg-[#1C1C1E] text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us
        </span>
      </a>

      {/* Main Footer */}
      <div className="bg-gradient-to-b from-[#FAF7F2] to-[#F0EBE1] border-t border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8963E] to-[#B8872E] flex items-center justify-center shadow-[0_4px_12px_rgba(200,150,62,0.3)]">
                  <span className="text-white font-bold text-sm">CJ</span>
                </div>
                <span className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E]">
                  Accessories By CJ
                </span>
              </Link>
              <p className="text-sm text-[#6B6B70] leading-relaxed mb-6">
                Premium mobile accessories crafted for those who demand the best. Quality you can feel.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm border border-[#E5E0D5] flex items-center justify-center text-[#6B6B70] hover:text-[#C8963E] hover:border-[#C8963E] transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm border border-[#E5E0D5] flex items-center justify-center text-[#6B6B70] hover:text-[#C8963E] hover:border-[#C8963E] transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm border border-[#E5E0D5] flex items-center justify-center text-[#6B6B70] hover:text-[#C8963E] hover:border-[#C8963E] transition-all duration-300"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-['Playfair_Display'] text-base font-semibold text-[#1C1C1E] mb-4">
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
                      className="text-sm text-[#6B6B70] hover:text-[#C8963E] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-['Playfair_Display'] text-base font-semibold text-[#1C1C1E] mb-4">
                Customer Service
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Shipping Policy", to: "/shipping-policy" },
                  { label: "Payment Methods", to: "/payments" },
                  { label: "Warranty Claim", to: "/warranty-claim" },
                  { label: "Shopping Cart", to: "/cart" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#6B6B70] hover:text-[#C8963E] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-['Playfair_Display'] text-base font-semibold text-[#1C1C1E] mb-4">
                Contact Info
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Phone className="w-4 h-4 text-[#C8963E] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#6B6B70]">0312 0141004</span>
                </li>
                <li className="flex gap-3">
                  <Mail className="w-4 h-4 text-[#C8963E] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#6B6B70] break-all">
                    accesoriesbycj@gmail.com
                  </span>
                </li>
                <li className="flex gap-3">
                  <MapPin className="w-4 h-4 text-[#C8963E] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#6B6B70] leading-relaxed">
                    House No 50A, 21 Achar Sacheem, Samanabad, Lahore, 54000, Pakistan
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#E5E0D5]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#A0A0A5]">
              &copy; {new Date().getFullYear()} Accessories By CJ. All rights reserved.
            </p>
            <p className="text-xs text-[#A0A0A5]">
              Made with love in Lahore, Pakistan
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
