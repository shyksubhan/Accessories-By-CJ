import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Payments from "@/pages/Payments";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ShippingPolicy from "@/pages/ShippingPolicy";
import WarrantyClaim from "@/pages/WarrantyClaim";
import NotFound from "@/pages/NotFound";

// Admin pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminMessages from "@/pages/admin/AdminMessages";
import AdminWarranty from "@/pages/admin/AdminWarranty";
import { isAdminAuthenticated } from "@/lib/api";

const queryClient = new QueryClient();

// Guard for admin routes
function AdminGuard({ children }: { children: React.ReactNode }) {
  if (!isAdminAuthenticated()) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

// Store layout wrapper (with Navbar + Footer)
function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* ─── Admin Routes (no Navbar/Footer) ─── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
            <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
            <Route path="/admin/messages" element={<AdminGuard><AdminMessages /></AdminGuard>} />
            <Route path="/admin/warranty" element={<AdminGuard><AdminWarranty /></AdminGuard>} />

            {/* ─── Store Routes (with Navbar/Footer) ─── */}
            <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
            <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
            <Route path="/product/:id" element={<StoreLayout><ProductDetail /></StoreLayout>} />
            <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
            <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
            <Route path="/payments" element={<StoreLayout><Payments /></StoreLayout>} />
            <Route path="/about" element={<StoreLayout><About /></StoreLayout>} />
            <Route path="/contact" element={<StoreLayout><Contact /></StoreLayout>} />
            <Route path="/shipping-policy" element={<StoreLayout><ShippingPolicy /></StoreLayout>} />
            <Route path="/warranty-claim" element={<StoreLayout><WarrantyClaim /></StoreLayout>} />
            <Route path="*" element={<StoreLayout><NotFound /></StoreLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
