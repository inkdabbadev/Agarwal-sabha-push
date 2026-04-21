import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("id, title, message, link, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      // If the announcements table has not been created yet, keep the site usable.
      if ("code" in error && error.code === "42P01") {
        return NextResponse.json({
          ok: true,
          announcement: null
        });
      }

      throw new Error(error.message);
    }

    return NextResponse.json({
      ok: true,
      announcement: data ?? null
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        announcement: null,
        error: error instanceof Error ? error.message : "Unable to load announcement."
      },
      { status: 500 }
    );
  }
}
