import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, ArrowLeft } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const { data: user } = await supabase
    .from("User")
    .select("role")
    .eq("clerkId", userId)
    .single();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#05050a] text-white flex pt-16">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 fixed top-16 left-0 h-[calc(100vh-4rem)] p-5 flex flex-col">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back to Store
        </Link>

        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/5">
          <p className="text-xs text-gray-500 px-3">NovaShop Admin</p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}