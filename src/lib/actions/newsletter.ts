"use server";

import { newsletterSchema } from "@/lib/validation";

export type NewsletterState = {
  status: "idle" | "success" | "error";
  message?: string;
};

/**
 * Newsletter signup — STUB.
 *
 * Validates the email and pretends to subscribe. Wire this to your ESP
 * (Resend audiences, Mailchimp, Klaviyo, etc.) when ready; the UI contract
 * won't change.
 */
export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.flatten().fieldErrors.email?.[0] ?? "Invalid email.",
    };
  }

  // TODO: integrate with your email service provider here.
  await new Promise((r) => setTimeout(r, 400));

  return {
    status: "success",
    message: "You're on the list. Welcome to RoyceDSP.",
  };
}
