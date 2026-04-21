import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";
import type { SendResponse } from "firebase-admin/messaging";

import { getFirebaseAdminMessaging } from "@/lib/firebase-admin";
import { getSupabaseAdminClient } from "@/lib/supabase";
import {
  getValidationMessage,
  normalizeNotificationLink,
  sendNotificationSchema
} from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INVALID_TOKEN_CODES = new Set([
  "messaging/invalid-registration-token",
  "messaging/registration-token-not-registered",
  "messaging/invalid-argument"
]);

function splitIntoChunks<T>(items: T[], chunkSize: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}

function isValidPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  const providedBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

function collectInvalidTokens(tokens: string[], responses: SendResponse[]) {
  return responses.reduce<string[]>((invalidTokens, response, index) => {
    if (response.success) {
      return invalidTokens;
    }

    const errorCode = response.error?.code;

    if (errorCode && INVALID_TOKEN_CODES.has(errorCode)) {
      invalidTokens.push(tokens[index]);
    }

    return invalidTokens;
  }, []);
}

export async function POST(request: Request) {
  try {
    const payload = sendNotificationSchema.parse(await request.json());

    if (!isValidPassword(payload.password)) {
      return NextResponse.json(
        { ok: false, error: "Invalid admin password.", sent: 0, failed: 0 },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const normalizedLink = normalizeNotificationLink(payload.link);

    const { data: announcement, error: announcementError } = await supabase
      .from("announcements")
      .insert({
        title: payload.title,
        message: payload.message,
        link: payload.link ? normalizedLink : null
      })
      .select("id")
      .single();

    const announcementTableMissing =
      announcementError && "code" in announcementError && announcementError.code === "42P01";

    if (announcementError && !announcementTableMissing) {
      throw new Error(announcementError.message);
    }

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("token")
      .eq("is_active", true);

    if (error) {
      throw new Error(error.message);
    }

    const tokens = [...new Set((data ?? []).map((entry) => entry.token).filter(Boolean))];

    if (!tokens.length) {
      return NextResponse.json({
        ok: true,
        sent: 0,
        failed: 0,
        invalidated: 0,
        announcementId: announcement?.id
      });
    }

    const messaging = getFirebaseAdminMessaging();
    const chunks = splitIntoChunks(tokens, 500);

    let sent = 0;
    let failed = 0;
    const invalidTokens: string[] = [];

    for (const chunk of chunks) {
      const response = await messaging.sendEachForMulticast({
        tokens: chunk,
        notification: {
          title: payload.title,
          body: payload.message
        },
        data: {
          link: normalizedLink,
          title: payload.title,
          message: payload.message
        },
        webpush: {
          fcmOptions: {
            link: normalizedLink
          },
          notification: {
            title: payload.title,
            body: payload.message
          }
        }
      });

      sent += response.successCount;
      failed += response.failureCount;
      invalidTokens.push(...collectInvalidTokens(chunk, response.responses));
    }

    const uniqueInvalidTokens = [...new Set(invalidTokens)];

    if (uniqueInvalidTokens.length) {
      const { error: deactivateError } = await supabase
        .from("push_subscriptions")
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .in("token", uniqueInvalidTokens);

      if (deactivateError) {
        throw new Error(deactivateError.message);
      }
    }

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      invalidated: uniqueInvalidTokens.length,
      announcementId: announcement?.id
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        sent: 0,
        failed: 0,
        error: getValidationMessage(error, "Unable to send notification.")
      },
      { status: 400 }
    );
  }
}
