import { z } from "zod";

const relativeOrAbsoluteUrl = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) {
      return true;
    }

    if (value.startsWith("/")) {
      return true;
    }

    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Link must be a relative path or an absolute http(s) URL.");

export const subscribeSchema = z.object({
  token: z.string().trim().min(20, "A valid push token is required.")
});

export const sendNotificationSchema = z.object({
  password: z.string().min(1, "Admin password is required."),
  title: z.string().trim().min(1, "Title is required.").max(80, "Title is too long."),
  message: z.string().trim().min(1, "Message is required.").max(240, "Message is too long."),
  link: relativeOrAbsoluteUrl.optional().transform((value) => value?.trim() || "")
});

export function normalizeNotificationLink(link?: string) {
  if (!link) {
    return "/";
  }

  return link.trim();
}

export function getValidationMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
