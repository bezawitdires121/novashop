"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: any;
  comparePrice: any;
  stock: number;
  images: { url: string; alt: string | null }[];
  category: { name: string } | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { isSignedIn } = useUser();
  const wishlisted = isWishlisted(product.id);

  const image = product.images[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
  const discount = product.comparePrice
    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image,
      quantity: 1,
      stock: product.stock,
    });
    toast.success(product.name + " added to cart");
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Sign in to save to wishlist");
      return;
    }

    toggle(product.id);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (data.action === "added") {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
    } catch {
      toggle(product.id);
      toast.error("Something went wrong");
    }
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-3xl overflow-hidden border border-white/5"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <Link href={"/products/" + product.slug}>
        <div className="relative aspect-square overflow-hidden bg-[#16161f]">
          <motion.img
            src={image}
            alt={product.name}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full h-full object-cover"
          />

          {discount && discount > 0 && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#6272f6] text-white text-xs font-bold">
              -{discount}%
            </div>
          )}

          {product.stock <= 10 && product.stock > 0 && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-orange-500/90 text-white text-xs font-medium">
              Only {product.stock} left
            </div>
          )}

          <motion.button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={product.stock <= 10 && product.stock > 0 ? { top: "44px" } : {}}
          >
            <Heart
              size={16}
              className={wishlisted ? "fill-red-500 text-red-500" : "text-white"}
            />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 right-3"
          >
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-[#6272f6] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={15} />
              {product.stock === 0 ? "Sold Out" : "Add to Cart"}
            </button>
          </motion.div>
        </div>

        <div className="p-4">
          {product.category && (
            <p className="text-xs text-[#8196fb] font-medium mb-1 uppercase tracking-wide">
              {product.category.name}
            </p>
          )}
          <h3 className="text-white font-medium mb-2 line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">{formatPrice(Number(product.price))}</span>
            {product.comparePrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(Number(product.comparePrice))}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}