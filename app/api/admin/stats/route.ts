import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: orders } = await supabase.from("Order").select("*");
    const { data: products } = await supabase.from("Product").select("*");
    const { data: users } = await supabase.from("User").select("*");

    const totalRevenue = (orders || [])
      .filter((o: any) => o.paymentStatus === "PAID")
      .reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0);

    const totalOrders = orders?.length || 0;
    const totalProducts = products?.length || 0;
    const totalCustomers = (users || []).filter((u: any) => u.role === "USER").length;

    const recentOrders = (orders || [])
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const lowStockProducts = (products || []).filter((p: any) => p.stock <= 10 && p.stock > 0);

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders,
      lowStockProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}