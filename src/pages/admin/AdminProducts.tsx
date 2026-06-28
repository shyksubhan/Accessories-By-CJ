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
      className="w-12 h-12 rounded-lg object-cover bg-[#F5F0E8]"
      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/48x48/F5F0E8/C8963E?text=CJ"; }}
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A5]" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#E5E0D5] bg-white focus:outline-none focus:border-[#C8963E]"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-sm bg-[#C8963E] hover:bg-[#B8862E] text-white font-medium rounded-xl transition-colors shadow-sm"
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
          <div className="w-7 h-7 border-2 border-[#C8963E] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] flex flex-col items-center justify-center py-20 gap-3">
          <Package className="w-12 h-12 text-[#D4C9B5]" />
          <p className="text-[#6B6B70] font-medium">No products found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9F7F2] border-b border-[#E5E0D5]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide hidden sm:table-cell">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B70] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductImage src={p.image} alt={p.name} />
                        <div>
                          <p className="font-medium text-[#1C1C1E]">{p.name}</p>
                          {p.badge && (
                            <span className="text-xs bg-[#C8963E]/10 text-[#C8963E] font-medium px-1.5 py-0.5 rounded-md">{p.badge}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6B6B70] hidden md:table-cell">{p.category}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#1C1C1E]">Rs. {p.price.toLocaleString()}</p>
                      {p.originalPrice && (
                        <p className="text-xs text-[#A0A0A5] line-through">Rs. {p.originalPrice.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-[#6B6B70] hover:bg-[#F5F0E8] hover:text-[#C8963E] transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg text-[#6B6B70] hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-[#F9F7F2] border-t border-[#E5E0D5]">
            <p className="text-xs text-[#A0A0A5]">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-[#E5E0D5] flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-[#1C1C1E]">{editProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-[#F5F0E8] transition-colors">
                <X className="w-4 h-4 text-[#6B6B70]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#6B6B70] uppercase tracking-wide mb-2">Product Image</label>
                <div
                  className="border-2 border-dashed border-[#E5E0D5] rounded-xl p-4 text-center cursor-pointer hover:border-[#C8963E]/40 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl mx-auto" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <ImageIcon className="w-8 h-8 text-[#D4C9B5]" />
                      <p className="text-xs text-[#A0A0A5]">Click to upload image (max 5MB)</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#6B6B70] uppercase tracking-wide mb-1.5">Name *</label>
                  <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Product name" className="w-full border border-[#E5E0D5] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C8963E]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B6B70] uppercase tracking-wide mb-1.5">Category *</label>
                  <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-[#E5E0D5] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C8963E] bg-white">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B6B70] uppercase tracking-wide mb-1.5">Badge</label>
                  <input value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Best Seller, New" className="w-full border border-[#E5E0D5] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C8963E]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B6B70] uppercase tracking-wide mb-1.5">Price (Rs.) *</label>
                  <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="3499" className="w-full border border-[#E5E0D5] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C8963E]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B6B70] uppercase tracking-wide mb-1.5">Original Price (Rs.)</label>
                  <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="4499 (optional)" className="w-full border border-[#E5E0D5] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C8963E]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#6B6B70] uppercase tracking-wide mb-1.5">Description *</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3} placeholder="Product description..." className="w-full border border-[#E5E0D5] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C8963E] resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#6B6B70] uppercase tracking-wide mb-1.5">Features (one per line)</label>
                  <textarea value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={4} placeholder={"65W Output\nGaN Technology\nDual USB-C"} className="w-full border border-[#E5E0D5] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C8963E] resize-none font-mono text-xs" />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="inStock" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} className="w-4 h-4 accent-[#C8963E]" />
                  <label htmlFor="inStock" className="text-[#4A4A50] cursor-pointer">In Stock</label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[#F5F0E8] hover:bg-[#EDE8DC] text-[#1C1C1E] font-medium py-2.5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 bg-[#C8963E] hover:bg-[#B8862E] text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60">
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
            <h3 className="font-semibold text-[#1C1C1E] mb-2">Delete Product?</h3>
            <p className="text-sm text-[#6B6B70] mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-[#F5F0E8] hover:bg-[#EDE8DC] text-[#1C1C1E] font-medium py-2.5 rounded-xl transition-colors text-sm">
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
