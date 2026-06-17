"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Check } from "lucide-react";
import {
  subscribeToNewsletter,
  type NewsletterState,
} from "@/lib/actions/newsletter";
import { GlassInput } from "@/components/ui/glass/glass-input";

const initial: NewsletterState = { status: "idle" };

function SubmitButton({ success }: { success: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || success}
      aria-label="Subscribe"
      className="glass-sheen absolute right-1.5 top-1.5 grid size-10 place-items-center rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] transition-transform duration-300 hover:scale-105 active:scale-95 disabled:opacity-60"
    >
      {success ? (
        <Check className="size-4" strokeWidth={2} />
      ) : (
        <ArrowRight
          className={`size-4 transition-transform ${pending ? "translate-x-0.5 opacity-60" : ""}`}
          strokeWidth={2}
        />
      )}
    </button>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeToNewsletter, initial);
  const success = state.status === "success";

  return (
    <div className="w-full max-w-sm">
      <form action={formAction} className="relative">
        <GlassInput
          type="email"
          name="email"
          required
          placeholder="your@studio.com"
          aria-label="Email address"
          disabled={success}
          className="h-[3.25rem] rounded-full pr-14"
        />
        <SubmitButton success={success} />
      </form>
      <p
        className={`mt-3 text-xs ${
          state.status === "error"
            ? "text-red-500"
            : "text-[var(--color-ink-faint)]"
        }`}
        role="status"
      >
        {state.message ??
          "Occasional dispatches on new tools and sound. No noise."}
      </p>
    </div>
  );
}
