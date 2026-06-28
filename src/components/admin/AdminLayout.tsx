import { useNavigate } from "react-router-dom";
import { isAdminAuthenticated, clearAdminToken } from "@/lib/api";
import {
  LayoutDashboard, ShoppingBag, Package, MessageSquare, Shield, LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
  { label: "Warranty", path: "/admin/warranty", icon: Shield },
];

export default function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentPath = window.location.pathname;

  if (!isAdminAuthenticated()) {
    navigate("/admin/login");
    return null;
  }

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8963E] to-[#D4A851] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">CJ</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">Acc-by-CJ</p>
            <p className="text-white/50 text-xs mt-0.5">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = path === "/admin" ? currentPath === "/admin" : currentPath.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => { navigate(path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[#C8963E] text-white shadow-[0_4px_12px_rgba(200,150,62,0.35)]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-red-500/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F5F0E8] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 bg-[#1C1C1E] flex-col shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-[#1C1C1E] flex flex-col">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-[#E5E0D5] px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg text-[#6B6B70] hover:bg-[#F5F0E8] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-[#1C1C1E]">{title}</h1>
          </div>
          <a href="/" target="_blank" className="text-xs text-[#C8963E] hover:underline font-medium">
            View Store →
          </a>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
