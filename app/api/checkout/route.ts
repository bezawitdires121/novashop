import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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

    const body = await req.json();
    const { items, shippingAddress, shippingCost } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // cents
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      metadata: {
        userId,
        shippingAddress: JSON.stringify(shippingAddress),
        cartItems: JSON.stringify(
          items.map((i: any) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}