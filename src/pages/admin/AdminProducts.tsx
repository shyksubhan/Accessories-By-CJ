import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { productsApi, type ApiProduct } from "@/lib/api";
import { Plus, Pencil, Trash2, Search, Package, X, AlertCircle, ImageIcon } from "lucide-react";

const CATEGORIES = ["Chargers", "Cables", "Power Banks", "Earbuds", "Cases"] as const;

const BACKEND = "http://localhost:3001";

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const fullSrc = src?.startsWith("http") ? src : `${BACKEND}${src}`;
  return (
    <img src={fullSrc} alt={alt}
      className="w-12 h-12 rounded-lg object-cover bg-[#EFF6FF]"
      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/48x48/EFF6FF/1A56DB?text=CJ"; }}
    />
  );
}

interface ProductFormData {
  name: string; category: string; price: string; originalPrice: string;
  description: string; features: string; badge: string; inStock: boolean;
}

const EMPTY_FORM: ProductFormData = {
  name: "", category: "Chargers", price: "", originalPrice: "",
  description: "", features: "", badge: "", inStock: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ApiProduct | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProducts = () => {
    setLoading(true);
    productsApi.getAllAdmin()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditProduct(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setShowForm(true);
  };

  const openEdit = (p: ApiProduct) => {
    setEditProduct(p);
    setFormData({
      name: p.name, category: p.category,
      price: String(p.price), originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      description: p.description, features: p.features.join("\n"),
      badge: p.badge || "", inStock: p.inStock,
    });
    setImagePreview(p.image?.startsWith("http") ? p.image : `${BACKEND}${p.image}`);
    setImageFile(null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("category", formData.category);
      fd.append("price", formData.price);
      if (formData.originalPrice) fd.append("originalPrice", formData.originalPrice);
      fd.append("description", formData.description);
      fd.append("features", JSON.stringify(formData.features.split("\n").map((f) => f.trim()).filter(Boolean)));
      if (formData.badge) fd.append("badge", formData.badge);
      fd.append("inStock", String(formData.inStock));
      if (imageFile) fd.append("image", imageFile);

      if (editProduct) {
        await productsApi.update(editProduct.id, fd);
      } else {
        await productsApi.create(fd);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productsApi.delete(id);
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  return (
    <AdminLayout title="Products">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-blue-100 bg-white focus:outline-none focus:border-[#1A56DB]"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-sm bg-[#1A56DB] hover:bg-[#1648C0] text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-blue-100 flex flex-col items-center justify-center py-20 gap-3">
          <Package className="w-12 h-12 text-[#BFDBFE]" />
          <p className="text-[#475569] font-medium">No products found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-blue-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wide hidden sm:table-cell">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductImage src={p.image} alt={p.name} />
                        <div>
                          <p className="font-medium text-[#0F1629]">{p.name}</p>
                          {p.badge && (
                            <span className="text-xs bg-[#1A56DB]/10 text-[#1A56DB] font-medium px-1.5 py-0.5 rounded-md">{p.badge}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#475569] hidden md:table-cell">{p.category}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#0F1629]">Rs. {p.price.toLocaleString()}</p>
                      {p.originalPrice && (
                        <p className="text-xs text-[#94A3B8] line-through">Rs. {p.originalPrice.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-[#475569] hover:bg-[#EFF6FF] hover:text-[#1A56DB] transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg text-[#475569] hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-[#F8FAFC] border-t border-blue-100">
            <p className="text-xs text-[#94A3B8]">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-blue-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-[#0F1629]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{editProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-[#EFF6FF] transition-colors">
                <X className="w-4 h-4 text-[#475569]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">Product Image</label>
                <div
                  className="border-2 border-dashed border-blue-100 rounded-xl p-4 text-center cursor-pointer hover:border-[#1A56DB]/40 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl mx-auto" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <ImageIcon className="w-8 h-8 text-[#BFDBFE]" />
                      <p className="text-xs text-[#94A3B8]">Click to upload image (max 5MB)</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-1.5">Name *</label>
                  <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Product name" className="w-full border border-blue-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1A56DB]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-1.5">Category *</label>
                  <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-blue-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1A56DB] bg-white">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-1.5">Badge</label>
                  <input value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Best Seller, New" className="w-full border border-blue-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1A56DB]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-1.5">Price (Rs.) *</label>
                  <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="3499" className="w-full border border-blue-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1A56DB]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-1.5">Original Price (Rs.)</label>
                  <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="4499 (optional)" className="w-full border border-blue-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1A56DB]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-1.5">Description *</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3} placeholder="Product description..." className="w-full border border-blue-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1A56DB] resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-1.5">Features (one per line)</label>
                  <textarea value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={4} placeholder={"65W Output\nGaN Technology\nDual USB-C"} className="w-full border border-blue-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1A56DB] resize-none font-mono text-xs" />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="inStock" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} className="w-4 h-4 accent-[#1A56DB]" />
                  <label htmlFor="inStock" className="text-[#4A4A50] cursor-pointer">In Stock</label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0F1629] font-medium py-2.5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 bg-[#1A56DB] hover:bg-[#1648C0] text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60">
                  {submitting ? "Saving..." : (editProduct ? "Save Changes" : "Add Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-[#0F1629] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Delete Product?</h3>
            <p className="text-sm text-[#475569] mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0F1629] font-medium py-2.5 rounded-xl transition-colors text-sm">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
