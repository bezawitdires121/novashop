"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Shield, Truck, Star, Users, Package, TrendingUp, Heart } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { value: "70+", label: "Premium Products", icon: Package },
    { value: "15", label: "Categories", icon: ShoppingBag },
    { value: "50K+", label: "Happy Customers", icon: Users },
    { value: "4.9★", label: "Average Rating", icon: Star },
  ];

  const values = [
    { icon: Shield, title: "Quality First", desc: "Every product is carefully curated and quality-checked before it reaches you." },
    { icon: Truck, title: "Fast Delivery", desc: "We partner with the best logistics providers to ensure your order arrives on time." },
    { icon: Heart, title: "Customer Love", desc: "Our support team is available 24/7 to help you with anything you need." },
    { icon: TrendingUp, title: "Always Innovating", desc: "We constantly expand our catalog with the latest and most innovative products." },
  ];

  const team = [
    { name: "Bezawit Dires", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
    { name: "Abel Daniel", role: "Head of Product", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    { name: "Sofia Seifu", role: "Lead Designer", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
    { name: "Teddy Tesfahun", role: "Head of Engineering", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  ];

  return (
    <main className="min-h-screen bg-[#05050a] text-white pt-28 pb-20">

      {/* Hero */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#6272f6] opacity-[0.06] rounded-full blur-[100px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative max-w-3xl mx-auto">
          <p className="text-[#6272f6] text-sm font-medium mb-4 tracking-widest uppercase">Our Story</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Shopping
            <span className="bg-gradient-to-r from-[#6272f6] to-[#a5bcfd] bg-clip-text text-transparent"> Reimagined</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            NovaShop was born from a simple idea , that online shopping should be as exciting and premium as walking into the world's finest stores. We curate the best products across every category, delivering them to you with unmatched speed and care.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-white/5 text-center"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <Icon size={24} className="text-[#6272f6] mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#6272f6] text-sm font-medium mb-3 tracking-widest uppercase">Our Mission</p>
            <h2 className="text-4xl font-bold mb-6">Making Premium Accessible to Everyone</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              We believe everyone deserves access to quality products without compromising on style, sustainability, or service. NovaShop partners directly with manufacturers and innovative brands to bring you the best at prices that make sense.
            </p>
            <p className="text-gray-400 leading-relaxed">
              From cutting-edge electronics to artisan gourmet foods, every item in our catalog is chosen with intention — backed by real reviews, transparent pricing, and a team that genuinely cares.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden aspect-square"
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
              alt="Team working"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05050a]/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-16 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#6272f6] text-sm font-medium mb-3 tracking-widest uppercase">What We Stand For</p>
            <h2 className="text-4xl font-bold">Our Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl border border-white/5"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#6272f6]/10 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-[#6272f6]" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#6272f6] text-sm font-medium mb-3 tracking-widest uppercase">The People Behind NovaShop</p>
            <h2 className="text-4xl font-bold">Meet Our Team</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#6272f6]/30">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-[#8196fb] text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-gray-400 mb-8">Discover thousands of premium products curated just for you.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-[#6272f6] hover:bg-[#4f54ea] text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(98,114,246,0.4)]"
          >
            <ShoppingBag size={20} />
            Shop Now
          </Link>
        </motion.div>
      </section>

    </main>
  );
}