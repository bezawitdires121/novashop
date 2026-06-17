import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await supabase.from("ProductImage").delete().eq("productId", params.id);
    const { error } = await supabase.from("Product").delete().eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}