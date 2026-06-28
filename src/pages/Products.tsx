import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high">("default");

  const filtered = useMemo(() => {
    let result = [...products];
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
  }, [selectedCategory, search, sortBy]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-title mb-2">All Products</h1>
          <p className="section-subtitle">Browse our complete collection of premium accessories</p>
        </div>

        {/* Filters Bar */}
        <div className="glass rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A5]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-[#E5E0D5] text-sm text-[#1C1C1E] focus:border-[#C8963E] focus:ring-2 focus:ring-[#C8963E]/20 outline-none transition-all"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                !selectedCategory
                  ? "bg-[#C8963E] text-white shadow-[0_4px_12px_rgba(200,150,62,0.25)]"
                  : "bg-white/60 text-[#6B6B70] hover:bg-white/80 border border-[#E5E0D5]"
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
                    ? "bg-[#C8963E] text-white shadow-[0_4px_12px_rgba(200,150,62,0.25)]"
                    : "bg-white/60 text-[#6B6B70] hover:bg-white/80 border border-[#E5E0D5]"
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
            className="px-4 py-2.5 rounded-xl bg-white/70 border border-[#E5E0D5] text-sm text-[#1C1C1E] outline-none focus:border-[#C8963E] transition-all cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Active Filters */}
        {(selectedCategory || search) && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-[#A0A0A5]">
              {filtered.length} {filtered.length === 1 ? "product" : "products"} found
            </span>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#C8963E]/10 text-[#C8963E] text-xs font-medium rounded-lg hover:bg-[#C8963E]/20 transition-colors"
              >
                {selectedCategory} <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SlidersHorizontal className="w-12 h-12 text-[#D4C9B5] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1C1C1E] mb-2">No products found</h3>
            <p className="text-[#6B6B70]">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
