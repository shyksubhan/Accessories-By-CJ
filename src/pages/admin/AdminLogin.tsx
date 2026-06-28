import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi, setAdminToken } from "@/lib/api";
import { Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await adminApi.login(username, password);
      setAdminToken(res.token);
      localStorage.setItem("cj_admin_user", JSON.stringify(res.admin));
      navigate("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#1C1C1E] px-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C8963E]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#C8963E]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C8963E] to-[#D4A851] flex items-center justify-center mx-auto mb-4 shadow-[0_8px_32px_rgba(200,150,62,0.4)]">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-white/50 text-sm mt-1">Acc-by-CJ Management</p>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/60 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8963E]/60 focus:bg-white/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8963E]/60 focus:bg-white/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#C8963E] to-[#D4A851] hover:from-[#B8862E] hover:to-[#C49841] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-[0_4px_14px_rgba(200,150,62,0.4)] hover:shadow-[0_6px_20px_rgba(200,150,62,0.5)] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          © 2024 Acc-by-CJ. Admin access only.
        </p>
      </div>
    </div>
  );
}
