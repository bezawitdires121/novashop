"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 24, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden p-8 md:p-12"
        style={{
          background: "linear-gradient(135deg, #6272f6 0%, #4f54ea 50%, #3e41cf 100%)",
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold mb-4">
              <Zap size={14} />
              FLASH SALE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Up to 50% Off Selected Items
            </h2>
            <p className="text-white/80">Limited time offer. Don't miss out.</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Countdown */}
            <div className="flex gap-2">
              {[
                { value: timeLeft.hours, label: "HRS" },
                { value: timeLeft.minutes, label: "MIN" },
                { value: timeLeft.seconds, label: "SEC" },
              ].map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm text-2xl font-bold text-white mb-1">
                    {pad(unit.value)}
                  </div>
                  <span className="text-xs text-white/70">{unit.label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/shop"
              className="px-6 py-3.5 rounded-xl bg-white text-[#4f54ea] font-bold hover:scale-105 transition-transform whitespace-nowrap"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}