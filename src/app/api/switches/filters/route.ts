import { supabaseAdmin } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type");

    if (type === "filters") {
      const { data, error } = await supabaseAdmin.rpc("get_filters");

      if (error) {
        return NextResponse.json(
          { error: "Error fetching filters" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        filters: data,
      });
    }

    if (type === "suggestions") {
      const searchInput = req.nextUrl.searchParams.get("query") ?? "";

      const { data, error } = await supabaseAdmin
        .from("switches")
        .select()
        .or(
          `name.ilike.%${searchInput}%,brand.ilike.%${searchInput}%,series.ilike.%${searchInput}%`,
        )
        .limit(5);

      if (error) {
        return NextResponse.json(
          { error: "Error fetching search suggestions" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        suggestions: data,
      });
    }

    return NextResponse.json(
      { error: "Invalid request type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Switches API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
