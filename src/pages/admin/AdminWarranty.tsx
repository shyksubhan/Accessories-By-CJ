import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { warrantyApi, type ApiWarrantyClaim } from "@/lib/api";
import { Search, Shield, Filter, ChevronDown, Eye, Trash2, AlertCircle, RefreshCw, Image as ImageIcon } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  open:         { label: "Open",         color: "#D97706", bg: "#FEF3C7" },
  under_review: { label: "Under Review", color: "#2563EB", bg: "#DBEAFE" },
  approved:     { label: "Approved",     color: "#059669", bg: "#D1FAE5" },
  rejected:     { label: "Rejected",     color: "#DC2626", bg: "#FEE2E2" },
  resolved:     { label: "Resolved",     color: "#6B7280", bg: "#F3F4F6" },
};

const STATUSES = ["all", "open", "under_review", "approved", "rejected", "resolved"];
const BACKEND = "http://localhost:3001";

export default function AdminWarranty() {
  const [claims, setClaims] = useState<ApiWarrantyClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<ApiWarrantyClaim | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchClaims = () => {
    setLoading(true);
    warrantyApi.getAll({ status: statusFilter, search })
      .then((res) => setClaims(res.claims))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClaims(); }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchClaims(); };

  const handleStatusChange = async (id: string, status: string, notes?: string) => {
    setUpdatingId(id);
    try {
      const updated = await warrantyApi.updateStatus(id, status, notes);
      setClaims((prev) => prev.map((c) => c.id === id ? updated : c));
      if (selected?.id === id) setSelected(updated);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await warrantyApi.delete(id);
      setClaims((prev) => prev.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  const openClaim = (c: ApiWarrantyClaim) => {
    setSelected(c);
    setAdminNotes(c.adminNotes || "");
  };

  const filtered = claims.filter((c) =>
    c.claimNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.product.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = claims.filter((c) => c.status === "open").length;

  return (
    <AdminLayout title="Warranty Claims">
      {openCount > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4 text-sm text-amber-700 font-medium">
          <Shield className="w-4 h-4" />
          {openCount} open claim{openCount !== 1 ? "s" : ""} awaiting review
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A5]" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search claims..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#E5E0D5] bg-white focus:outline-none focus:border-[#C8963E]"
          />
        </form>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A5]" />
          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 text-sm rounded-xl border border-[#E5E0D5] bg-white appearance-none focus:outline-none focus:border-[#C8963E] cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s === "all" ? "All Statuses" : STATUS_CONFIG[s]?.label || s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#A0A0A5] pointer-events-none" />
        </div>
        <button onClick={fetchClaims} className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border border-[#E5E0D5] bg-white hover:bg-[#F5F0E8] transition-colors text-[#6B6B70]">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 border-2 border-[#C8963E] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] flex flex-col items-center justify-center py-20 gap-3">
          <Shield className="w-12 h-12 text-[#D4C9B5]" />
          <p className="text-[#6B6B70] font-medium">No warranty claims found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9F7F2] border-b border-[#E5E0D5]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Claim #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide hidden md:table-cell">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                {filtered.map((claim) => (
                  <tr key={claim.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#1C1C1E]">#{claim.claimNumber}</p>
                      <p className="text-xs text-[#A0A0A5]">{new Date(claim.createdAt).toLocaleDateString("en-PK")}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1C1C1E]">{claim.customer.fullName}</p>
                      <p className="text-xs text-[#A0A0A5]">{claim.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-[#4A4A50]">{claim.product.name}</p>
                      <p className="text-xs text-[#A0A0A5]">{claim.product.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block">
                        <select
                          value={claim.status}
                          onChange={(e) => handleStatusChange(claim.id, e.target.value)}
                          disabled={updatingId === claim.id}
                          className="appearance-none text-xs font-medium px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer pr-5"
                          style={{ color: STATUS_CONFIG[claim.status]?.color, background: STATUS_CONFIG[claim.status]?.bg }}
                        >
                          {STATUSES.filter((s) => s !== "all").map((s) => (
                            <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 pointer-events-none" style={{ color: STATUS_CONFIG[claim.status]?.color }} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openClaim(claim)} className="flex items-center gap-1 text-xs text-[#C8963E] hover:underline font-medium">
                          <Eye className="w-3 h-3" /> View
                        </button>
                        <button
                          onClick={() => handleDelete(claim.id)}
                          disabled={deletingId === claim.id}
                          className="p-1.5 rounded-lg text-[#6B6B70] hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-[#F9F7F2] border-t border-[#E5E0D5]">
            <p className="text-xs text-[#A0A0A5]">{filtered.length} claim{filtered.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}

      {/* Claim Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#E5E0D5] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#1C1C1E]">Claim #{selected.claimNumber}</h2>
                <p className="text-xs text-[#A0A0A5]">{new Date(selected.createdAt).toLocaleString("en-PK")}</p>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ color: STATUS_CONFIG[selected.status]?.color, background: STATUS_CONFIG[selected.status]?.bg }}>
                {STATUS_CONFIG[selected.status]?.label}
              </span>
            </div>

            <div className="p-5 space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wide mb-2">Customer</p>
                <p className="font-medium text-[#1C1C1E]">{selected.customer.fullName}</p>
                <p className="text-[#6B6B70]">{selected.customer.phone}</p>
                {selected.customer.email && <p className="text-[#6B6B70]">{selected.customer.email}</p>}
                {selected.customer.orderNumber && <p className="text-[#6B6B70]">Order: #{selected.customer.orderNumber}</p>}
              </div>

              <div>
                <p className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wide mb-2">Product</p>
                <p className="font-medium text-[#1C1C1E]">{selected.product.name}</p>
                <p className="text-[#6B6B70]">{selected.product.category} · Purchased: {selected.product.purchaseDate}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wide mb-2">Issue Description</p>
                <div className="bg-[#F9F7F2] rounded-xl p-3 text-[#4A4A50] leading-relaxed whitespace-pre-wrap">{selected.issueDesc}</div>
              </div>

              {selected.imagePath && (
                <div>
                  <p className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wide mb-2">Attached Photo</p>
                  <a href={`${BACKEND}${selected.imagePath}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`${BACKEND}${selected.imagePath}`}
                      alt="Warranty claim photo"
                      className="w-full max-h-48 object-contain rounded-xl border border-[#E5E0D5] hover:opacity-90 transition-opacity cursor-zoom-in"
                    />
                  </a>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wide mb-2">Admin Notes</p>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Add internal notes about this claim..."
                  className="w-full border border-[#E5E0D5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8963E] resize-none"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wide mb-2">Update Status</p>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value, adminNotes)}
                  className="w-full border border-[#E5E0D5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8963E]"
                >
                  {STATUSES.filter((s) => s !== "all").map((s) => (
                    <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-[#E5E0D5] flex gap-3">
              <button
                onClick={() => handleStatusChange(selected.id, selected.status, adminNotes)}
                disabled={updatingId === selected.id}
                className="flex-1 bg-[#C8963E] hover:bg-[#B8862E] text-white font-medium py-2.5 rounded-xl transition-colors text-sm disabled:opacity-60"
              >
                {updatingId === selected.id ? "Saving..." : "Save Notes & Status"}
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 bg-[#F5F0E8] hover:bg-[#EDE8DC] text-[#1C1C1E] font-medium py-2.5 rounded-xl transition-colors text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
