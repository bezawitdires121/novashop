"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle, ArrowRight } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  const cards = [
    { label: "Total Revenue", value: formatPrice(stats?.totalRevenue || 0), icon: DollarSign, color: "#6272f6" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "#8196fb" },
    { label: "Products", value: stats?.totalProducts || 0, icon: Package, color: "#a5bcfd" },
    { label: "Customers", value: stats?.totalCustomers || 0, icon: Users, color: "#4f54ea" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">Welcome back! Here's what's happening with your store.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/5 p-5"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${card.color}15` }}
              >
                <Icon size={20} style={{ color: card.color }} />
              </div>
              <p className="text-2xl font-bold mb-1">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-[#6272f6] hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {stats?.recentOrders?.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentOrders?.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="font-mono text-sm text-[#8196fb]">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(Number(order.totalAmount))}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentStatus === "PAID" ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="rounded-2xl border border-white/5 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-orange-400" />
            <h2 className="font-semibold text-lg">Low Stock</h2>
          </div>

          {stats?.lowStockProducts?.length === 0 ? (
            <p className="text-gray-500 text-sm">All products well stocked.</p>
          ) : (
            <div className="space-y-3">
              {stats?.lowStockProducts?.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <p className="text-sm line-clamp-1">{product.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full text-orange-400 bg-orange-400/10 whitespace-nowrap">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}