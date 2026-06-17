"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = Math.max(subtotal + shipping - couponDiscount, 0);

  const applyCoupon = async () => {
    if (!couponCode.trim()) { toast.error("Enter a coupon code"); return; }
    const res = await fetch("/api/coupons?code=" + couponCode.trim());
    const data = await res.json();
    if (!res.ok || data.error) {
      setCouponMsg(data.error || "Invalid coupon");
      setCouponDiscount(0);
      toast.error(data.error || "Invalid coupon");
      return;
    }
    const discount = data.type === "PERCENTAGE"
      ? (subtotal * Number(data.value)) / 100
      : Number(data.value);
    const finalDiscount = Math.min(discount, subtotal);
    setCouponDiscount(finalDiscount);
    setCouponMsg("Coupon applied! You saved " + (data.type === "PERCENTAGE" ? data.value + "%" : formatPrice(finalDiscount)));
    toast.success("Coupon applied!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shippingAddress: form, shippingCost: shipping }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Checkout failed"); setSubmitting(false); return; }
      window.location.href = data.url;
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#05050a] text-white pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Add some products before checking out.</p>
        <Link href="/shop" className="px-8 py-3.5 rounded-xl bg-[#6272f6] hover:bg-[#4f54ea] text-white font-semibold transition-colors">
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05050a] text-white pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
        <h1 className="text-4xl font-bold mb-10">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-10">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="md:col-span-2 space-y-6"
          >
            <div>
              <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="col-span-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none transition-colors" />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="col-span-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none transition-colors" />
                <input required placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="col-span-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none transition-colors" />
                <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none transition-colors" />
                <input required placeholder="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none transition-colors" />
                <input required placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="col-span-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none transition-colors" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#6272f6] hover:bg-[#4f54ea] text-white font-semibold text-lg transition-colors disabled:opacity-60"
            >
              <CreditCard size={20} />
              {submitting ? "Processing..." : "Place Order " + formatPrice(total)}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/5 p-6 h-fit"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none text-sm text-white placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="px-4 py-2 rounded-xl bg-[#6272f6]/20 hover:bg-[#6272f6]/30 text-[#8196fb] text-sm font-medium transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={"text-xs mt-1 " + (couponDiscount > 0 ? "text-green-400" : "text-red-400")}>
                  {couponMsg}
                </p>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/5">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 mt-4 text-center">
              Try coupon codes: NOVA20 or SAVE50
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}