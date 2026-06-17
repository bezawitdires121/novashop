"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { usePreferencesStore, CURRENCIES, LANGUAGES } from "@/store/preferences";

export default function PreferencesSelector() {
  const [open, setOpen] = useState(false);
  const { currency, language, setCurrency, setLanguage } = usePreferencesStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <Globe size={15} />
        <span>{CURRENCIES[currency].label}</span>
        <ChevronDown size={13} className={open ? "rotate-180" : ""} style={{ transition: "transform 0.2s" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 overflow-hidden z-50"
            style={{ background: "rgba(10,10,20,0.95)", backdropFilter: "blur(20px)" }}
          >
            <div className="p-3">
              <p className="text-xs text-gray-500 font-medium mb-2 px-1">Currency</p>
              {(Object.keys(CURRENCIES) as (keyof typeof CURRENCIES)[]).map((c) => (
                <button
                  key={c}
                  onClick={() => { setCurrency(c); }}
                  className={"w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors " + (currency === c ? "bg-[#6272f6]/20 text-[#8196fb]" : "text-gray-400 hover:bg-white/5 hover:text-white")}
                >
                  <span>{CURRENCIES[c].label}</span>
                  <span className="text-xs opacity-60">{CURRENCIES[c].symbol}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-white/5 p-3">
              <p className="text-xs text-gray-500 font-medium mb-2 px-1">Language</p>
              {(Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[]).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLanguage(l); }}
                  className={"w-full text-left px-3 py-2 rounded-xl text-sm transition-colors " + (language === l ? "bg-[#6272f6]/20 text-[#8196fb]" : "text-gray-400 hover:bg-white/5 hover:text-white")}
                >
                  {LANGUAGES[l]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}