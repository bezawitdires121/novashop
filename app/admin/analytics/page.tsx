"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { formatPrice } from "@/lib/utils";

const COLORS = ["#6272f6", "#8196fb", "#a5bcfd", "#4f54ea", "#3e41cf"];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading analytics...</p>;

  const revenueData = [
    { month: "Jan", revenue: 1200 },
    { month: "Feb", revenue: 1900 },
    { month: "Mar", revenue: 2400 },
    { month: "Apr", revenue: 2100 },
    { month: "May", revenue: 3200 },
    { month: "Jun", revenue: stats?.totalRevenue || 0 },
  ];

  const orderData = [
    { day: "Mon", orders: 4 },
    { day: "Tue", orders: 7 },
    { day: "Wed", orders: 5 },
    { day: "Thu", orders: 9 },
    { day: "Fri", orders: 12 },
    { day: "Sat", orders: 8 },
    { day: "Sun", orders: stats?.totalOrders || 0 },
  ];

  const categoryData = [
    { name: "Electronics", value: 35 },
    { name: "Apparel", value: 20 },
    { name: "Home", value: 15 },
    { name: "Beauty", value: 18 },
    { name: "Other", value: 12 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-400">Track your store performance and growth</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: formatPrice(stats?.totalRevenue || 0), change: "+12.5%" },
          { label: "Total Orders", value: stats?.totalOrders || 0, change: "+8.2%" },
          { label: "Products", value: stats?.totalProducts || 0, change: "+3 new" },
          { label: "Customers", value: stats?.totalCustomers || 0, change: "+24%" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/5 p-5"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <p className="text-gray-500 text-xs mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold mb-1">{kpi.value}</p>
            <p className="text-green-400 text-xs">{kpi.change} this month</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/5 p-6"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <h2 className="font-semibold mb-4">Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                labelStyle={{ color: "#fff" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#6272f6" strokeWidth={2} dot={{ fill: "#6272f6" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/5 p-6"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <h2 className="font-semibold mb-4">Orders This Week</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="orders" fill="#6272f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/5 p-6"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <h2 className="font-semibold mb-4">Sales by Category</h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ResponsiveContainer width={240} height={240}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                {categoryData.map((_, index) => (
                  <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-sm text-gray-300">{cat.name}</span>
                <span className="text-sm font-semibold ml-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}