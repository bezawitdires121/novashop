import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress, subtotal, shippingCost, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Find or create the User row linked to this Clerk user
    let { data: user, error: userError } = await supabase
      .from("User")
      .select("*")
      .eq("clerkId", userId)
      .single();

    if (userError && userError.code === "PGRST116") {
      // No user found — create one
      const { data: newUser, error: createError } = await supabase
        .from("User")
        .insert({
          id: `user_${userId}`,
          clerkId: userId,
          email: shippingAddress.email || "unknown@novashop.com",
          name: shippingAddress.fullName || "NovaShop Customer",
          role: "USER",
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error("User creation error:", createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      user = newUser;
    } else if (userError) {
      console.error("User lookup error:", userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // 2. Create the Order
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const orderNumber = generateOrderNumber();

    const { data: order, error: orderError } = await supabase
      .from("Order")
      .insert({
        id: orderId,
        orderNumber,
        userId: user.id,
        status: "PENDING",
        paymentStatus: "PENDING",
        subtotal,
        shippingCost,
        discountAmount: 0,
        totalAmount,
        shippingAddress,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // 3. Create OrderItems
    const orderItems = items.map((item: any) => ({
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      orderId: order.id,
      productId: item.productId,
      productName: item.name,
      productImage: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("OrderItem")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabase
      .from("User")
      .select("id")
      .eq("clerkId", userId)
      .single();

    if (!user) {
      return NextResponse.json([]);
    }

    const { data: orders, error } = await supabase
      .from("Order")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch order items for each order
    const orderIds = orders.map((o: any) => o.id);
    const { data: items } = await supabase
      .from("OrderItem")
      .select("*")
      .in("orderId", orderIds.length > 0 ? orderIds : ["none"]);

    const formatted = orders.map((o: any) => ({
      ...o,
      items: (items || []).filter((i: any) => i.orderId === o.id),
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}