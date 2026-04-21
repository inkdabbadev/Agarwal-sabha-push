import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase";
import { getValidationMessage, subscribeSchema } from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = subscribeSchema.parse(await request.json());
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        token: payload.token,
        is_active: true,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: "token"
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: getValidationMessage(error, "Unable to save subscription.") },
      { status: 400 }
    );
  }
}
