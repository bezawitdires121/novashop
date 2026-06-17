"use client";
import OrderTracker from "@/components/common/OrderTracker";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Package, ChevronRight } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  PROCESSING: "text-purple-400 bg-purple-400/10",
  SHIPPED: "text-orange-400 bg-orange-400/10",
  DELIVERED: "text-green-400 bg-green-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
};

export default function OrdersPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen bg-[#05050a] pt-32 flex items-center justify-center text-gray-500">
        Loading...
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-[#05050a] text-white pt-32 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-bold mb-2">Sign in to view your orders</h1>
        <p className="text-gray-400">You need to be logged in to see your order history.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05050a] text-white pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-700" />
            <p>You haven't placed any orders yet.</p>
            <Link href="/shop" className="text-[#6272f6] hover:underline mt-2 inline-block">
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/5 p-5"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-mono text-sm text-[#8196fb]">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "text-gray-400 bg-gray-400/10"}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  {order.items?.slice(0, 4).map((item: any) => (
                    <img
                      key={item.id}
                      src={item.productImage}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover border border-white/5"
                    />
                  ))}
                  {order.items?.length > 4 && (
                    <span className="text-sm text-gray-500">+{order.items.length - 4} more</span>
                  )}
                </div>
<div className="my-4">
                  <OrderTracker status={order.status} />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-gray-400 text-sm">{order.items?.length || 0} items</span>
                  <span className="font-bold">{formatPrice(Number(order.totalAmount))}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-gray-400 text-sm">{order.items?.length || 0} items</span>
                  <span className="font-bold">{formatPrice(Number(order.totalAmount))}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}