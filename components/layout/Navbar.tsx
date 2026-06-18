"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  Sun,
  Moon,
} from "lucide-react";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart";
import PreferencesSelector from "@/components/layout/PreferencesSelector";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ✅ Hooks MUST be here
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useUser();

  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className="absolute inset-0 border-b border-white/5 transition-all duration-300"
        style={{
          backdropFilter: "blur(20px)",
          background: scrolled
            ? "rgba(5,5,10,0.95)"
            : "rgba(5,5,10,0.7)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-white flex-shrink-0"
        >
          Nova<span className="text-[#6272f6]">Shop</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400 flex-shrink-0">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <PreferencesSelector />

          {/* Theme Toggle */}
          <button
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="p-2.5 rounded-xl hover:bg-white/5 transition-colors duration-200"
          >
            {mounted && theme === "dark" ? (
              <Sun
                size={18}
                className="text-gray-400 hover:text-white"
              />
            ) : (
              <Moon
                size={18}
                className="text-gray-400 hover:text-white"
              />
            )}
          </button>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors duration-200"
          >
            <ShoppingBag size={20} className="text-white" />

            {mounted && totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-[#6272f6] text-white text-xs font-bold"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* Auth */}
          {isSignedIn ? (
            <Link
              href="/profile"
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <User
                size={18}
                className="text-gray-400 hover:text-white"
              />
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6272f6] hover:bg-[#4f54ea] text-white text-sm font-medium transition-all duration-200 hover:scale-105">
                <User size={15} />
                Sign in
              </button>
            </SignInButton>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? (
              <X size={20} className="text-white" />
            ) : (
              <Menu size={20} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden relative border-t border-white/5 overflow-hidden"
            style={{ background: "rgba(5,5,10,0.98)" }}
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}