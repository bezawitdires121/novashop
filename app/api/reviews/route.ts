import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    const { data: reviews, error } = await supabase
      .from("Review")
      .select("*")
      .eq("productId", productId)
      .eq("isPublished", true)
      .order("createdAt", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const userIds = [...new Set((reviews || []).map((r: any) => r.userId))];

    let users: any[] = [];
    if (userIds.length > 0) {
      const { data } = await supabase
        .from("User")
        .select("id, name, imageUrl")
        .in("id", userIds);
      users = data || [];
    }

    const formatted = (reviews || []).map((r: any) => ({
      ...r,
      user: users.find((u) => u.id === r.userId) || { name: "Anonymous", imageUrl: null },
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, rating, title, comment } = body;

    if (!productId || !rating) {
      return NextResponse.json({ error: "productId and rating are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const { data: user } = await supabase
      .from("User")
      .select("id")
      .eq("clerkId", userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: existing } = await supabase
      .from("Review")
      .select("id")
      .eq("productId", productId)
      .eq("userId", user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 });
    }

    const { data: orders } = await supabase
      .from("OrderItem")
      .select("id, order:orderId(userId, paymentStatus)")
      .eq("productId", productId);

    const isVerified = (orders || []).some((item: any) =>
      item.order && item.order.userId === user.id && item.order.paymentStatus === "PAID"
    );

    const { data: review, error } = await supabase
      .from("Review")
      .insert({
        id: "review_" + Date.now(),
        productId,
        userId: user.id,
        rating,
        title: title || null,
        comment: comment || null,
        isVerified,
        isPublished: true,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}