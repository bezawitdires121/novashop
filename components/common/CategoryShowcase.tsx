"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
    size: "large",
  },
  {
    name: "Apparel",
    slug: "apparel",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
    size: "small",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    size: "small",
  },
  {
    name: "Watches",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    size: "small",
  },
  {
    name: "Audio",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    size: "small",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-[#6272f6] text-sm font-medium mb-1 tracking-widest uppercase">Browse</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {/* Large featured */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2 row-span-2"
          >
            <Link href={`/shop?category=${CATEGORIES[0].slug}`} className="group relative block h-full min-h-[280px] rounded-3xl overflow-hidden">
              <img
                src={CATEGORIES[0].image}
                alt={CATEGORIES[0].name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{CATEGORIES[0].name}</h3>
                <span className="inline-flex items-center gap-1 text-sm text-white/80 group-hover:text-white">
                  Shop now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Smaller tiles */}
          {CATEGORIES.slice(1).map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 1) * 0.08 }}
              viewport={{ once: true }}
            >
              <Link href={`/shop?category=${cat.slug}`} className="group relative block h-full min-h-[130px] rounded-3xl overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-base font-bold text-white">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}