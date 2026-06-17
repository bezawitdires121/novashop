"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  PROCESSING: "text-purple-400 bg-purple-400/10",
  SHIPPED: "text-orange-400 bg-orange-400/10",
  DELIVERED: "text-green-400 bg-green-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
  REFUNDED: "text-gray-400 bg-gray-400/10",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status } : o));
      toast.success("Order status updated");
    } else {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-gray-400">Manage and track all customer orders</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-mono text-[#8196fb] text-xs">{order.orderNumber}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4 font-semibold">{formatPrice(Number(order.totalAmount))}</td>
                  <td className="px-5 py-4">
                    <span className={"px-2 py-1 rounded-full text-xs " + (order.paymentStatus === "PAID" ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10")}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={"px-2 py-1 rounded-full text-xs " + (STATUS_COLORS[order.status] || "text-gray-400 bg-gray-400/10")}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#0a0a0f]">{s}</option>
                      ))}
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}