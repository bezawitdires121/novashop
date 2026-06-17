"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const clearCart = useCartStore((state) => state.clearCart);

  const confirmedRef = useRef(false);

  useEffect(() => {
    if (!sessionId || confirmedRef.current) return;
    confirmedRef.current = true;

    fetch("/api/orders/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus("error");
        } else {
          setOrder(data.order);
          setStatus("success");
          clearCart();
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#05050a] text-white pt-32 pb-20 px-6 flex flex-col items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#6272f6] mb-4" />
        <p className="text-gray-400">Confirming your order...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen bg-[#05050a] text-white pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
        <p className="text-gray-400 mb-6">We couldn't confirm your order. Please contact support.</p>
        <Link href="/shop" className="text-[#6272f6] hover:underline">
          Return to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05050a] text-white pt-32 pb-20 px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-[#6272f6]/10 border border-[#6272f6]/30"
        >
          <CheckCircle size={40} className="text-[#6272f6]" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
        <p className="text-gray-400 mb-6">
          Thank you for your purchase. Payment received successfully.
        </p>

        {order && (
          <div
            className="rounded-2xl border border-white/5 p-4 mb-8"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-lg font-mono font-semibold text-[#8196fb]">{order.orderNumber}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/orders"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#6272f6] hover:bg-[#4f54ea] text-white font-semibold transition-colors"
          >
            <Package size={18} />
            View Orders
          </Link>
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-white font-semibold transition-colors"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}