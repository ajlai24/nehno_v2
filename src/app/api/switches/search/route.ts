import { supabaseAdmin } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchInput = req.nextUrl.searchParams.get("query") ?? "";

  if (!searchInput) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabaseAdmin
    .from("switches")
    .select("id, name, brand, series")
    .or(
      `name.ilike.%${searchInput}%,brand.ilike.%${searchInput}%,series.ilike.%${searchInput}%`,
    )
    .limit(5);

  if (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
