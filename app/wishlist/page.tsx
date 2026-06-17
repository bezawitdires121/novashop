"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { useWishlistStore } from "@/store/wishlist";

export default function WishlistPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setItems } = useWishlistStore();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetch("/api/wishlist")
        .then((r) => r.json())
        .then((data) => {
          const items = Array.isArray(data) ? data : [];
          setProducts(items);
          setItems(items.map((p: any) => p.id));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen bg-[#05050a] pt-32 flex items-center justify-center text-gray-500">
        Loading...
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-[#05050a] text-white pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <Heart size={48} className="text-gray-700 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Sign in to view your wishlist</h1>
        <Link href="/sign-in" className="mt-4 text-[#6272f6] hover:underline">Sign in</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05050a] text-white pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-[#6272f6] text-sm font-medium mb-2 tracking-widest uppercase">Saved Items</p>
          <h1 className="text-4xl font-bold">My Wishlist</h1>
          <p className="text-gray-400 mt-2">{products.length} {products.length === 1 ? "item" : "items"} saved</p>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={56} className="mx-auto mb-4 text-gray-700" />
            <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
            <Link
              href="/shop"
              className="px-6 py-3 rounded-xl bg-[#6272f6] hover:bg-[#4f54ea] text-white font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}