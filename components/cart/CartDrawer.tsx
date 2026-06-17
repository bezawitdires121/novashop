"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-[60]"
            style={{ backdropFilter: "blur(4px)" }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#0a0a0f] border-l border-white/10 z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <ShoppingBag size={18} />
                Your Cart
                <span className="text-sm text-gray-500">({items.length})</span>
              </h2>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-gray-700 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#6272f6] hover:bg-[#4f54ea] text-white text-sm font-medium transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="flex gap-4 p-3 rounded-2xl border border-white/5"
                        style={{ background: "rgba(255,255,255,0.02)" }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-sm font-medium text-white line-clamp-1">{item.name}</h3>
                          <p className="text-[#8196fb] font-semibold mt-1">{formatPrice(item.price)}</p>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 px-1">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-1 hover:text-[#6272f6] transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="p-1 hover:text-[#6272f6] transition-colors disabled:opacity-30"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/5 px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-xl font-bold text-white">{formatPrice(getTotalPrice())}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center py-3.5 rounded-xl bg-[#6272f6] hover:bg-[#4f54ea] text-white font-semibold transition-all duration-200 hover:scale-[1.02]"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}