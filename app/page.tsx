"use client";
import HeroSlideshow from "@/components/common/HeroSlideshow";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Star, Zap, Shield } from "lucide-react";
import FlashSaleBanner from "@/components/common/FlashSaleBanner";
import CategoryShowcase from "@/components/common/CategoryShowcase";
import ProductCarousel from "@/components/common/ProductCarousel";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const featured = products.filter((p) => p.isFeatured);
  const trending = [...products].reverse();

  return (
    <main className="min-h-screen bg-[#05050a] text-white overflow-hidden">

  <HeroSlideshow />

      {/* ── CATEGORY SHOWCASE ── */}
      <CategoryShowcase />

      {/* ── FLASH SALE ── */}
      <FlashSaleBanner />

      {/* ── FEATURED PRODUCTS ── */}
      <ProductCarousel products={featured} title="Featured Products" subtitle="Curated for you" />

      {/* ── TRENDING ── */}
      <ProductCarousel products={trending} title="Trending Now" subtitle="Popular this week" />

      {/* ── STATS ── */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "10K+", label: "Products" },
            { number: "50K+", label: "Happy Customers" },
            { number: "99%", label: "Satisfaction Rate" },
            { number: "4.9★", label: "Average Rating" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 rounded-2xl border border-white/5 text-center overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(10px)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#6272f6]/5 to-transparent" />
              <p className="relative text-4xl font-bold text-white mb-1">{stat.number}</p>
              <p className="relative text-gray-500 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      {/* ── FOOTER ── */}
      <footer className="relative border-t border-white/5 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            {/* Brand */}
            <div className="col-span-2">
              <p className="text-3xl font-bold text-white mb-4">Nova<span className="text-[#6272f6]">Shop</span></p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                The next generation of premium eCommerce. Curated products, seamless shopping, delivered to your door.
              </p>
              <div className="flex gap-3">
                {["Twitter", "Instagram", "LinkedIn", "YouTube"].map((s) => (
                  <button key={s} className="w-9 h-9 rounded-xl border border-white/10 hover:border-[#6272f6]/50 hover:bg-[#6272f6]/10 flex items-center justify-center text-gray-500 hover:text-[#6272f6] transition-colors text-xs font-bold">
                    {s[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: "Shop", links: ["All Products", "New Arrivals", "Best Sellers", "Sale", "Brands"] },
              { title: "Support", links: ["Help Center", "Track Order", "Returns", "Contact Us", "FAQs"] },
              { title: "Company", links: ["About Us", "Careers", "Press", "Blog", "Partnerships"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="font-semibold text-white mb-4">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="rounded-2xl border border-white/5 p-8 mb-12" style={{ background: "rgba(98,114,246,0.05)" }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Stay in the loop</h3>
                <p className="text-gray-400 text-sm">Get exclusive deals, new arrivals and style inspiration.</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-72 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none text-sm text-white placeholder:text-gray-500 transition-colors"
                />
                <button className="px-6 py-3 rounded-xl bg-[#6272f6] hover:bg-[#4f54ea] text-white text-sm font-semibold transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5 text-sm text-gray-600">
            <p>© 2026 NovaShop. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="hover:text-gray-400 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { size: 80, top: "15%", left: "10%", delay: 0, color: "#6272f6" },
        { size: 50, top: "25%", right: "12%", delay: 1, color: "#8196fb" },
        { size: 120, bottom: "20%", left: "8%", delay: 2, color: "#4f54ea" },
        { size: 60, bottom: "30%", right: "10%", delay: 0.5, color: "#a5bcfd" },
        { size: 40, top: "60%", left: "20%", delay: 1.5, color: "#6272f6" },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: (orb as any).left,
            right: (orb as any).right,
            bottom: (orb as any).bottom,
            background: `radial-gradient(circle at 30% 30%, ${orb.color}40, ${orb.color}10)`,
            border: `1px solid ${orb.color}20`,
            backdropFilter: "blur(2px)",
          }}
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 6 + i, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}