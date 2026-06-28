import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, PackageOpen } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { productsApi, type ApiProduct } from "@/lib/api";

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high">("default");
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsApi.getAll().then((data) => {
      setAllProducts(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    return result;
  }, [allProducts, selectedCategory, search, sortBy]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-title mb-2">All Products</h1>
          <p className="section-subtitle">Browse our complete collection of premium accessories</p>
        </div>

        {/* Filters Bar */}
        <div className="glass rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-blue-100">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-blue-100 text-sm text-[#0F1629] focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20 outline-none transition-all"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                !selectedCategory
                  ? "bg-[#1A56DB] text-white shadow-[0_4px_12px_rgba(26,86,219,0.25)]"
                  : "bg-white text-[#64748B] hover:bg-[#EFF6FF] border border-blue-100"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-[#1A56DB] text-white shadow-[0_4px_12px_rgba(26,86,219,0.25)]"
                    : "bg-white text-[#64748B] hover:bg-[#EFF6FF] border border-blue-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2.5 rounded-xl bg-white border border-blue-100 text-sm text-[#0F1629] outline-none focus:border-[#1A56DB] transition-all cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Active Filters */}
        {(selectedCategory || search) && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-[#94A3B8]">
              {filtered.length} {filtered.length === 1 ? "product" : "products"} found
            </span>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1A56DB]/10 text-[#1A56DB] text-xs font-medium rounded-lg hover:bg-[#1A56DB]/20 transition-colors"
              >
                {selectedCategory} <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <PackageOpen className="w-16 h-16 text-[#BFDBFE] mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-[#0F1629] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {allProducts.length === 0 ? "Products Coming Soon" : "No products found"}
            </h3>
            <p className="text-[#64748B]">
              {allProducts.length === 0
                ? "We're adding products to our store. Check back soon or contact us on WhatsApp."
                : "Try adjusting your filters or search query"}
            </p>
            {allProducts.length === 0 && (
              <a
                href="https://wa.me/923120141004"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-medium hover:-translate-y-0.5 transition-all duration-300"
              >
                Chat on WhatsApp
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
