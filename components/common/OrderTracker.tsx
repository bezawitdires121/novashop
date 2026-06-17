"use client";

import { motion } from "framer-motion";
import { Package, CheckCircle, Truck, Home } from "lucide-react";

const STEPS = [
  { key: "CONFIRMED", label: "Order Confirmed", icon: CheckCircle },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: Home },
];

const STATUS_INDEX: Record<string, number> = {
  PENDING: -1,
  CONFIRMED: 0,
  PROCESSING: 1,
  SHIPPED: 2,
  DELIVERED: 3,
};

export default function OrderTracker({ status }: { status: string }) {
  const currentIndex = STATUS_INDEX[status] ?? -1;

  return (
    <div className="relative">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/5 z-0" />
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-[#6272f6] z-0"
          initial={{ width: "0%" }}
          animate={{ width: currentIndex >= 0 ? ((currentIndex / (STEPS.length - 1)) * 100) + "%" : "0%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i <= currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step.key} className="flex flex-col items-center gap-2 relative z-10">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: active ? 1.15 : 1 }}
                className={"w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors " + (done ? "bg-[#6272f6] border-[#6272f6]" : "bg-[#0a0a0f] border-white/20")}
              >
                <Icon size={18} className={done ? "text-white" : "text-gray-600"} />
              </motion.div>
              <span className={"text-xs text-center max-w-[70px] " + (done ? "text-white" : "text-gray-600")}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}