"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { User, Package, Heart, Star } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#05050a] pt-32 flex items-center justify-center text-gray-500">
        Loading...
      </main>
    );
  }

  const quickLinks = [
    { icon: Package, label: "My Orders", href: "/orders", desc: "Track and manage your orders" },
    { icon: Heart, label: "Wishlist", href: "/wishlist", desc: "Products you've saved" },
    { icon: Star, label: "My Reviews", href: "/orders", desc: "Reviews you've written" },
  ];

  return (
    <main className="min-h-screen bg-[#05050a] text-white pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-[#6272f6] text-sm font-medium mb-2 tracking-widest uppercase">Account</p>
          <h1 className="text-4xl font-bold">My Profile</h1>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/5 p-6 mb-8 flex items-center gap-6"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt={user.fullName || ""} className="w-20 h-20 rounded-full object-cover border-2 border-[#6272f6]/30" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#6272f6]/20 flex items-center justify-center">
              <User size={32} className="text-[#6272f6]" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold mb-1">{user?.fullName || "NovaShop Member"}</h2>
            <p className="text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
            <p className="text-xs text-gray-600 mt-1">Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2024"}</p>
          </div>
        </motion.div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {quickLinks.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="block p-6 rounded-2xl border border-white/5 hover:border-[#6272f6]/30 transition-colors group"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#6272f6]/10 flex items-center justify-center mb-4 group-hover:bg-[#6272f6]/20 transition-colors">
                    <Icon size={22} className="text-[#6272f6]" />
                  </div>
                  <h3 className="font-bold mb-1">{item.label}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}