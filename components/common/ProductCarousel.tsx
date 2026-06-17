"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

export default function ProductCarousel({ products, title, subtitle }: { products: any[]; title: string; subtitle?: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", slidesToScroll: "auto", dragFree: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            {subtitle && <p className="text-[#6272f6] text-sm font-medium mb-1 tracking-widest uppercase">{subtitle}</p>}
            <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="p-2.5 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="p-2.5 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {products.map((product) => (
              <div key={product.id} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] xl:flex-[0_0_23%]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}