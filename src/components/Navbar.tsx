import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

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
  const [searchResults, setSearchResults] = useState<typeof products>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      setSearchResults(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        ).slice(0, 5)
      );
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/75 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-b border-[#E5E0D5]/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8963E] to-[#B8872E] flex items-center justify-center shadow-[0_4px_12px_rgba(200,150,62,0.3)] group-hover:shadow-[0_6px_16px_rgba(200,150,62,0.4)] transition-all duration-300">
              <span className="text-white font-bold text-sm">CJ</span>
            </div>
            <span className="hidden sm:block font-['Playfair_Display'] text-lg font-semibold text-[#1C1C1E] tracking-tight">
              Accessories By CJ
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-[15px] font-medium text-[#4A4A50] hover:text-[#C8963E] rounded-xl hover:bg-[#C8963E]/5 transition-all duration-300"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 backdrop-blur-xl border border-[#E5E0D5] text-sm text-[#1C1C1E] focus:border-[#C8963E] focus:ring-2 focus:ring-[#C8963E]/20 outline-none shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }
                    }}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A5]" />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-2xl rounded-xl border border-[#E5E0D5] shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                      {searchResults.map((p) => (
                        <button
                          key={p.id}
                          className="w-full text-left px-4 py-3 hover:bg-[#C8963E]/5 transition-colors duration-200 flex items-center gap-3 border-b border-[#F0EBE1] last:border-0"
                          onClick={() => {
                            navigate(`/product/${p.id}`);
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-[#1C1C1E]">{p.name}</p>
                            <p className="text-xs text-[#A0A0A5]">{p.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-xl hover:bg-[#C8963E]/5 text-[#4A4A50] hover:text-[#C8963E] transition-all duration-300"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2.5 rounded-xl hover:bg-[#C8963E]/5 text-[#4A4A50] hover:text-[#C8963E] transition-all duration-300"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#C8963E] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(200,150,62,0.4)] animate-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-[#C8963E]/5 text-[#4A4A50] transition-all duration-300"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-[#E5E0D5]/50 pt-3 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-[15px] font-medium text-[#4A4A50] hover:text-[#C8963E] rounded-xl hover:bg-[#C8963E]/5 transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
