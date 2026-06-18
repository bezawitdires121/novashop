"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CATEGORY_IMAGES: Record<string, string> = {
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
  apparel: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
  "home-living": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
  "sports-outdoors": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80",
  books: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80",
  "toys-games": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&q=80",
  "jewelry-watches": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
  "pet-supplies": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80",
  automotive: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80",
  furniture: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  "office-supplies": "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=600&q=80",
  "garden-outdoor": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
  "baby-kids": "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80",
  "womens-fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]).then(([cats, prods]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      setProducts(Array.isArray(prods) ? prods : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getCount = (categoryId: string) => products.filter((p) => p.categoryId === categoryId).length;

  return (
    <main className="min-h-screen bg-[#05050a] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <p className="text-[#6272f6] text-sm font-medium mb-3 tracking-widest uppercase">Browse</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Categories</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Explore our full range of categories - from electronics to fashion, beauty, and beyond.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-3xl aspect-[4/3] shimmer-bg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="group relative block rounded-3xl overflow-hidden aspect-[4/3] border border-white/5"
                >
                  <img
                    src={CATEGORY_IMAGES[cat.slug] || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80"}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{getCount(cat.id)} products</span>
                      <ArrowRight size={16} className="text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}