import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: products, error: productsError } = await supabase
      .from("Product")
      .select("*")
      .eq("isPublished", true)
      .order("createdAt", { ascending: false });

    if (productsError) {
      console.error("Products error:", productsError);
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    const { data: images, error: imagesError } = await supabase
      .from("ProductImage")
      .select("*");

    if (imagesError) {
      console.error("Images error:", imagesError);
      return NextResponse.json({ error: imagesError.message }, { status: 500 });
    }

    const { data: categories, error: categoriesError } = await supabase
      .from("Category")
      .select("*");

    if (categoriesError) {
      console.error("Categories error:", categoriesError);
      return NextResponse.json({ error: categoriesError.message }, { status: 500 });
    }

    const formatted = products.map((p: any) => ({
      ...p,
      images: images.filter((img: any) => img.productId === p.id),
      category: categories.find((c: any) => c.id === p.categoryId) || null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}