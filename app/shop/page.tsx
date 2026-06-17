"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductGridSkeleton from "@/components/common/ProductGridSkeleton";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: any;
  comparePrice: any;
  stock: number;
  tags: string[];
  colors: string[];
  sizes: string[];
  images: { url: string; alt: string | null }[];
  category: { name: string; slug: string } | null;
  categoryId: string | null;
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/5 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-medium text-white mb-3"
      >
        {title}
        <ChevronDown size={14} className={"transition-transform " + (open ? "rotate-180" : "")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [sort, setSort] = useState("newest");

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(2000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [minRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => { if (p.category) map.set(p.category.slug, p.category.name); });
    return Array.from(map.entries());
  }, [products]);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors?.forEach((c) => set.add(c)));
    return Array.from(set).slice(0, 12);
  }, [products]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes?.forEach((s) => set.add(s)));
    return Array.from(set).slice(0, 12);
  }, [products]);

  const toggleFilter = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)) ||
        p.category?.name.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => p.category && selectedCategories.includes(p.category.slug));
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) => p.colors?.some((c) => selectedColors.includes(c)));
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes?.some((s) => selectedSizes.includes(s)));
    }

    if (inStockOnly) result = result.filter((p) => p.stock > 0);
    if (onSaleOnly) result = result.filter((p) => p.comparePrice && Number(p.comparePrice) > Number(p.price));
    result = result.filter((p) => Number(p.price) <= priceRange);

    switch (sort) {
      case "price-asc": result.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price-desc": result.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return result;
  }, [products, searchQuery, selectedCategories, selectedColors, selectedSizes, inStockOnly, onSaleOnly, priceRange, sort]);

  const activeFilterCount = selectedCategories.length + selectedColors.length + selectedSizes.length +
    (inStockOnly ? 1 : 0) + (onSaleOnly ? 1 : 0) + (priceRange < 2000 ? 1 : 0);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setPriceRange(2000);
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-[#05050a] text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[#6272f6] text-sm font-medium mb-2 tracking-widest uppercase">All Products</p>
          <h1 className="text-4xl font-bold mb-1">Shop NovaShop</h1>
          <p className="text-gray-400">{filtered.length} products</p>
        </div>

        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={"flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors " + (showFilters ? "border-[#6272f6] bg-[#6272f6]/10 text-[#8196fb]" : "border-white/10 text-gray-400 hover:bg-white/5")}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#6272f6] text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-sm text-gray-500 hover:text-white transition-colors">
                Clear all
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none text-sm text-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0a0a0f]">{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="hidden md:block overflow-hidden flex-shrink-0"
              >
                <div className="w-[280px] rounded-2xl border border-white/5 p-5 sticky top-28" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold">Filters</h3>
                    {activeFilterCount > 0 && (
                      <button onClick={clearAll} className="text-xs text-[#6272f6] hover:underline">Clear all</button>
                    )}
                  </div>

                  {/* Search */}
                  <FilterSection title="Search">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none text-sm text-white placeholder:text-gray-500 transition-colors"
                    />
                  </FilterSection>

                  {/* Category */}
                  <FilterSection title="Category">
                    <div className="space-y-2">
                      {categories.map(([slug, name]) => (
                        <label key={slug} className="flex items-center gap-2.5 text-sm cursor-pointer group">
                          <div
                            onClick={() => toggleFilter(selectedCategories, setSelectedCategories, slug)}
                            className={"w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer " + (selectedCategories.includes(slug) ? "bg-[#6272f6] border-[#6272f6]" : "border-white/20 group-hover:border-white/40")}
                          >
                            {selectedCategories.includes(slug) && <X size={10} className="text-white" />}
                          </div>
                          <span className={selectedCategories.includes(slug) ? "text-white" : "text-gray-400 group-hover:text-white"}>{name}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Price */}
                  <FilterSection title="Price Range">
                    <div className="px-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>$0</span>
                        <span className="text-white font-medium">${priceRange}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="10"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full accent-[#6272f6]"
                      />
                    </div>
                  </FilterSection>

                  {/* Colors */}
                  {allColors.length > 0 && (
                    <FilterSection title="Colors" defaultOpen={false}>
                      <div className="flex flex-wrap gap-2">
                        {allColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => toggleFilter(selectedColors, setSelectedColors, color)}
                            className={"px-3 py-1.5 rounded-lg border text-xs transition-colors " + (selectedColors.includes(color) ? "border-[#6272f6] bg-[#6272f6]/10 text-[#8196fb]" : "border-white/10 text-gray-400 hover:border-white/30")}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </FilterSection>
                  )}

                  {/* Sizes */}
                  {allSizes.length > 0 && (
                    <FilterSection title="Sizes" defaultOpen={false}>
                      <div className="flex flex-wrap gap-2">
                        {allSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
                            className={"w-10 h-10 rounded-lg border text-xs font-medium transition-colors " + (selectedSizes.includes(size) ? "border-[#6272f6] bg-[#6272f6]/10 text-[#8196fb]" : "border-white/10 text-gray-400 hover:border-white/30")}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </FilterSection>
                  )}

                  {/* Availability */}
                  <FilterSection title="Availability" defaultOpen={false}>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2.5 text-sm cursor-pointer group">
                        <div
                          onClick={() => setInStockOnly(!inStockOnly)}
                          className={"w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer " + (inStockOnly ? "bg-[#6272f6] border-[#6272f6]" : "border-white/20 group-hover:border-white/40")}
                        >
                          {inStockOnly && <X size={10} className="text-white" />}
                        </div>
                        <span className={inStockOnly ? "text-white" : "text-gray-400 group-hover:text-white"}>In Stock Only</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-sm cursor-pointer group">
                        <div
                          onClick={() => setOnSaleOnly(!onSaleOnly)}
                          className={"w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer " + (onSaleOnly ? "bg-[#6272f6] border-[#6272f6]" : "border-white/20 group-hover:border-white/40")}
                        >
                          {onSaleOnly && <X size={10} className="text-white" />}
                        </div>
                        <span className={onSaleOnly ? "text-white" : "text-gray-400 group-hover:text-white"}>On Sale</span>
                      </label>
                    </div>
                  </FilterSection>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <ProductGridSkeleton />
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">No products match your filters.</p>
                <button onClick={clearAll} className="px-6 py-2.5 rounded-xl bg-[#6272f6] hover:bg-[#4f54ea] text-white text-sm font-medium transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4) }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}