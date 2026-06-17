import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: products } = await supabase
      .from("Product")
      .select("*")
      .order("createdAt", { ascending: false });

    const { data: images } = await supabase.from("ProductImage").select("*");
    const { data: categories } = await supabase.from("Category").select("*");

    const formatted = (products || []).map((p: any) => ({
      ...p,
      images: (images || []).filter((img: any) => img.productId === p.id),
      category: (categories || []).find((c: any) => c.id === p.categoryId) || null,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}