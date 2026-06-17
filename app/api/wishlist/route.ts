import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: user } = await supabase
      .from("User").select("id").eq("clerkId", userId).single();
    if (!user) return NextResponse.json([]);

    const { data: wishlist } = await supabase
      .from("WishlistItem").select("*").eq("userId", user.id);

    const productIds = (wishlist || []).map((w: any) => w.productId);
    if (productIds.length === 0) return NextResponse.json([]);

    const { data: products } = await supabase
      .from("Product").select("*").in("id", productIds);

    const { data: images } = await supabase
      .from("ProductImage").select("*").in("productId", productIds);

    const { data: categories } = await supabase
      .from("Category").select("*");

    const formatted = (products || []).map((p: any) => ({
      ...p,
      images: (images || []).filter((img: any) => img.productId === p.id),
      category: (categories || []).find((c: any) => c.id === p.categoryId) || null,
      wishlistId: (wishlist || []).find((w: any) => w.productId === p.id)?.id,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();

    const { data: user } = await supabase
      .from("User").select("id").eq("clerkId", userId).single();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { data: existing } = await supabase
      .from("WishlistItem")
      .select("id")
      .eq("userId", user.id)
      .eq("productId", productId)
      .single();

    if (existing) {
      await supabase.from("WishlistItem").delete().eq("id", existing.id);
      return NextResponse.json({ action: "removed" });
    }

    await supabase.from("WishlistItem").insert({
      id: "wish_" + Date.now(),
      userId: user.id,
      productId,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ action: "added" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}