import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { contactApi, type ApiMessage } from "@/lib/api";
import { Search, MessageSquare, Mail, Phone, Trash2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selected, setSelected] = useState<ApiMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = () => {
    setLoading(true);
    contactApi.getAll({ unread: unreadOnly, search })
      .then((res) => setMessages(res.messages))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, [unreadOnly]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchMessages(); };

  const handleMarkRead = async (id: string) => {
    await contactApi.markRead(id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, isRead: true } : m));
    if (selected?.id === id) setSelected({ ...selected, isRead: true });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await contactApi.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  const openMessage = async (msg: ApiMessage) => {
    setSelected(msg);
    if (!msg.isRead) handleMarkRead(msg.id);
  };

  const filtered = messages.filter((m) =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <AdminLayout title="Contact Messages">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A5]" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#E5E0D5] bg-white focus:outline-none focus:border-[#C8963E]"
          />
        </form>
        <button
          onClick={() => setUnreadOnly(!unreadOnly)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border transition-colors font-medium ${
            unreadOnly ? "bg-[#C8963E] text-white border-[#C8963E]" : "bg-white text-[#6B6B70] border-[#E5E0D5] hover:bg-[#F5F0E8]"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Unread {unreadOnly && unreadCount > 0 && `(${unreadCount})`}
        </button>
        <button onClick={fetchMessages} className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border border-[#E5E0D5] bg-white hover:bg-[#F5F0E8] transition-colors text-[#6B6B70]">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {unreadCount > 0 && (
        <div className="flex items-center gap-2 bg-[#C8963E]/10 border border-[#C8963E]/20 rounded-xl px-4 py-2.5 mb-4 text-sm text-[#C8963E] font-medium">
          <Mail className="w-4 h-4" />
          {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
        </div>
      )}

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
          <MessageSquare className="w-12 h-12 text-[#D4C9B5]" />
          <p className="text-[#6B6B70] font-medium">No messages found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => openMessage(msg)}
              className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                !msg.isRead ? "border-[#C8963E]/30 bg-[#FDF9F3]" : "border-[#E5E0D5]"
              } ${selected?.id === msg.id ? "ring-2 ring-[#C8963E]/30" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.isRead && <div className="w-2 h-2 rounded-full bg-[#C8963E] shrink-0" />}
                    <p className={`text-sm font-medium text-[#1C1C1E] ${!msg.isRead ? "font-semibold" : ""}`}>{msg.fullName}</p>
                    <span className="text-xs text-[#A0A0A5]">·</span>
                    <p className="text-xs text-[#A0A0A5]">{new Date(msg.createdAt).toLocaleDateString("en-PK")}</p>
                  </div>
                  <p className="text-sm font-medium text-[#4A4A50] mb-1">{msg.subject}</p>
                  <p className="text-xs text-[#A0A0A5] truncate">{msg.message}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!msg.isRead && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMarkRead(msg.id); }}
                      className="p-1.5 rounded-lg text-[#6B6B70] hover:bg-green-50 hover:text-green-600 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                    disabled={deletingId === msg.id}
                    className="p-1.5 rounded-lg text-[#6B6B70] hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#E5E0D5] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#1C1C1E]">{selected.subject}</h2>
                <p className="text-xs text-[#A0A0A5]">{new Date(selected.createdAt).toLocaleString("en-PK")}</p>
              </div>
              {selected.isRead
                ? <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Read</span>
                : <span className="text-xs text-[#C8963E] font-medium">Unread</span>
              }
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[#6B6B70]">
                  <Phone className="w-4 h-4 text-[#C8963E]" />
                  <a href={`tel:${selected.phone}`} className="hover:text-[#C8963E] transition-colors">{selected.phone}</a>
                </div>
                {selected.email && (
                  <div className="flex items-center gap-2 text-[#6B6B70]">
                    <Mail className="w-4 h-4 text-[#C8963E]" />
                    <a href={`mailto:${selected.email}`} className="hover:text-[#C8963E] transition-colors">{selected.email}</a>
                  </div>
                )}
              </div>
              <div className="bg-[#F9F7F2] rounded-xl p-4">
                <p className="font-semibold text-[#1C1C1E] mb-2">From: {selected.fullName}</p>
                <p className="text-[#4A4A50] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
            <div className="p-5 border-t border-[#E5E0D5] flex gap-3">
              <button onClick={() => { handleDelete(selected.id); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 bg-[#F5F0E8] hover:bg-[#EDE8DC] text-[#1C1C1E] font-medium py-2 rounded-xl transition-colors text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
