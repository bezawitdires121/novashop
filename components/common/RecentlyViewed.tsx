"use client";

import { useEffect, useState } from "react";
import ProductCarousel from "@/components/common/ProductCarousel";

const KEY = "novashop-recently-viewed";

export function addRecentlyViewed(productId: string) {
  try {
    const existing: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const updated = [productId, ...existing.filter((id) => id !== productId)].slice(0, 10);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export default function RecentlyViewed({ currentId, allProducts }: { currentId: string; allProducts: any[] }) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
      const filtered = ids
        .filter((id) => id !== currentId)
        .map((id) => allProducts.find((p) => p.id === id))
        .filter(Boolean)
        .slice(0, 8);
      setProducts(filtered);
    } catch {}
  }, [currentId, allProducts]);

  if (products.length === 0) return null;

  return (
    <ProductCarousel
      products={products}
      title="Recently Viewed"
      subtitle="Your browsing history"
    />
  );
}