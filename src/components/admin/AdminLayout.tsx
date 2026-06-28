import { useNavigate } from "react-router-dom";
import { isAdminAuthenticated, clearAdminToken } from "@/lib/api";
import {
  LayoutDashboard, ShoppingBag, Package, MessageSquare,
  Shield, LogOut, Menu, ChevronRight, Zap,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard",  path: "/admin",           icon: LayoutDashboard },
  { label: "Orders",     path: "/admin/orders",    icon: ShoppingBag },
  { label: "Products",   path: "/admin/products",  icon: Package },
  { label: "Messages",   path: "/admin/messages",  icon: MessageSquare },
  { label: "Warranty",   path: "/admin/warranty",  icon: Shield },
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
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A56DB] to-[#3B82F6] flex items-center justify-center shadow-[0_4px_12px_rgba(26,86,219,0.4)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Acc-by-CJ
            </p>
            <p className="text-white/40 text-xs mt-0.5">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = path === "/admin" ? currentPath === "/admin" : currentPath.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => { navigate(path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[#1A56DB] text-white shadow-[0_4px_12px_rgba(26,86,219,0.35)]"
                  : "text-white/50 hover:text-white hover:bg-white/8"
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
      <div className="px-3 py-4 border-t border-white/8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-red-500/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F0F6FF] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 bg-[#0A0F1E] flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.15)]">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-[#0A0F1E] flex flex-col shadow-2xl">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-blue-100 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:bg-[#EFF6FF] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-[#0F1629]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {title}
            </h1>
          </div>
          <a
            href="/"
            target="_blank"
            className="text-xs text-[#1A56DB] hover:underline font-medium bg-[#EFF6FF] px-3 py-1.5 rounded-lg transition-colors hover:bg-[#DBEAFE]"
          >
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
