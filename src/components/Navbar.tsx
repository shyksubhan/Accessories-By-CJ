import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { productsApi, type ApiProduct } from "@/lib/api";
import { CjLogoSVG } from "@/components/CjLogo";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ApiProduct[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      productsApi.getAll().then((all) => {
        const q = searchQuery.toLowerCase();
        setSearchResults(
          all
            .filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            )
            .slice(0, 5)
        );
      }).catch(() => setSearchResults([]));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-2xl shadow-[0_4px_24px_rgba(26,86,219,0.08)] border-b border-blue-100/60"
          : "bg-white/60 backdrop-blur-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <CjLogoSVG
              size={44}
              glow={true}
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <span
              className="font-podium text-[#0F1629] text-xs sm:text-sm tracking-wider uppercase font-extrabold select-none hidden sm:block"
            >
              Accessories by CJ
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-[15px] font-medium text-[#334155] hover:text-[#1A56DB] rounded-xl hover:bg-[#1A56DB]/5 transition-all duration-300"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 md:w-80">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-blue-200 text-sm text-[#0F1629] focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20 outline-none shadow-[0_4px_16px_rgba(26,86,219,0.08)] transition-all duration-300"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }
                    }}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-blue-100 shadow-[0_12px_40px_rgba(26,86,219,0.12)] overflow-hidden">
                      {searchResults.map((p) => (
                        <button
                          key={p.id}
                          className="w-full text-left px-4 py-3 hover:bg-[#1A56DB]/5 transition-colors duration-200 flex items-center gap-3 border-b border-blue-50 last:border-0"
                          onClick={() => {
                            navigate(`/product/${p.id}`);
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          {p.image && (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#0F1629]">{p.name}</p>
                            <p className="text-xs text-[#94A3B8]">{p.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-xl hover:bg-[#1A56DB]/5 text-[#334155] hover:text-[#1A56DB] transition-all duration-300"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Profile */}
            <button
              onClick={() => navigate("/profile")}
              className="p-2.5 rounded-xl hover:bg-[#1A56DB]/5 text-[#334155] hover:text-[#1A56DB] transition-all duration-300"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2.5 rounded-xl hover:bg-[#1A56DB]/5 text-[#334155] hover:text-[#1A56DB] transition-all duration-300"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#1A56DB] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(26,86,219,0.4)] animate-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-[#1A56DB]/5 text-[#334155] transition-all duration-300"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-blue-100/50 pt-3 animate-in slide-in-from-top-2 duration-300">
            {/* Mobile Brand Logo in Menu */}
            <div className="flex items-center gap-2 px-4 py-2 mb-2">
              <CjLogoSVG size={32} glow={false} />
              <span className="font-podium text-[#0F1629] text-[10px] tracking-wider uppercase font-extrabold">
                Accessories by CJ
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-[15px] font-medium text-[#334155] hover:text-[#1A56DB] rounded-xl hover:bg-[#1A56DB]/5 transition-all duration-300"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-[15px] font-medium text-[#334155] hover:text-[#1A56DB] rounded-xl hover:bg-[#1A56DB]/5 transition-all duration-300"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                My Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
