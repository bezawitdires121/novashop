import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

    const { data: coupon, error } = await supabase
      .from("Coupon")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("isActive", true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 404 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}