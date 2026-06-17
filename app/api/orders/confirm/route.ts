import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { generateOrderNumber } from "@/lib/utils";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("Order")
      .select("*")
      .eq("stripeSessionId", sessionId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, order: existing });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const shippingAddress = JSON.parse(session.metadata?.shippingAddress || "{}");
    const cartItems = JSON.parse(session.metadata?.cartItems || "[]");

    let { data: user } = await supabase
      .from("User")
      .select("*")
      .eq("clerkId", userId)
      .maybeSingle();

    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from("User")
        .insert({
          id: "user_" + userId,
          clerkId: userId,
          email: shippingAddress.email || "unknown@novashop.com",
          name: shippingAddress.fullName || "NovaShop Customer",
          role: "USER",
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      user = newUser;
    }

    const subtotal = cartItems.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
    const totalAmount = (session.amount_total || 0) / 100;
    const shippingCost = Math.max(totalAmount - subtotal, 0);

    const orderId = "order_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
    const orderNumber = generateOrderNumber();

    const { data: order, error: orderError } = await supabase
      .from("Order")
      .insert({
        id: orderId,
        orderNumber,
        userId: user.id,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        subtotal,
        shippingCost,
        discountAmount: 0,
        totalAmount,
        shippingAddress,
        stripeSessionId: sessionId,
        stripePaymentId: session.payment_intent as string,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    if (cartItems.length > 0) {
      const orderItems = cartItems.map((item: any) => ({
        id: "item_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8),
        orderId: order.id,
        productId: item.productId,
        productName: item.name,
        productImage: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      await supabase.from("OrderItem").insert(orderItems);
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Order confirmation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}