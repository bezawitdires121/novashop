"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    badge: "New Season",
    title: "Discover Premium",
    highlight: "Collections",
    subtitle: "Explore our curated selection of world-class products crafted for the modern lifestyle.",
    cta: "Shop Now",
    href: "/shop",
    color: "#6272f6",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
    badge: "Women's Fashion",
    title: "Style That",
    highlight: "Speaks Volumes",
    subtitle: "From elegant dresses to everyday essentials : fashion for every occasion.",
    cta: "Shop Women's",
    href: "/shop?category=womens-fashion",
    color: "#e6bfcd",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&q=80",
    badge: "Electronics",
    title: "Tech That",
    highlight: "Moves You",
    subtitle: "Cutting-edge gadgets and devices designed for the way you live and work.",
    cta: "Shop Electronics",
    href: "/shop?category=electronics",
    color: "#d1e5ed",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80",
    badge: "Home & Living",
    title: "Elevate Your",
    highlight: "Living Space",
    subtitle: "Transform every room with premium furniture, decor and lifestyle essentials.",
    cta: "Shop Home",
    href: "/shop?category=home-living",
    color: "#cbebdf",
  },
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="relative w-full h-[92vh] min-h-[600px] overflow-hidden bg-[#05050a]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
            center: { opacity: 1, x: 0 },
            exit: (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center px-8 md:px-16 lg:px-24">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 border"
                style={{ background: slide.color + "20", borderColor: slide.color + "40", color: slide.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: slide.color }} />
                {slide.badge}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold text-white mb-3 leading-tight"
              >
                {slide.title}
              </motion.h1>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                style={{ color: slide.color }}
              >
                {slide.highlight}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-300 text-lg mb-10 leading-relaxed max-w-lg"
              >
                {slide.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href={slide.href}
                  className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{ background: slide.color }}
                >
                  {slide.cta}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/categories"
                  className="px-8 py-4 rounded-2xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  Browse All
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? "32px" : "8px",
              height: "8px",
              background: i === current ? slide.color : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 text-white/50 text-sm font-mono z-10">
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}