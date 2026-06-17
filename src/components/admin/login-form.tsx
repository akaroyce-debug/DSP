"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { login, type LoginState } from "@/lib/actions/auth";
import { GlassCard } from "@/components/ui/glass/glass-card";
import { GlassInput, Field } from "@/components/ui/glass/glass-input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="glass-sheen mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-ink)] text-sm font-medium text-[var(--color-paper)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
    >
      {pending ? "Verifying…" : "Enter"}
    </button>
  );
}

export function LoginForm() {
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin";
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <GlassCard strong className="w-full max-w-sm p-8 sm:p-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="glass mb-5 grid size-12 place-items-center rounded-2xl">
          <Lock className="size-5 text-[var(--color-ink)]" strokeWidth={1.5} />
        </span>
        <h1 className="font-display text-2xl font-medium tracking-tight">
          RoyceDSP Studio
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Enter the management console.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="from" value={from} />
        <Field label="Password" htmlFor="password" error={state.error}>
          <GlassInput
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            placeholder="••••••••••••"
          />
        </Field>
        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-xs text-[var(--color-ink-faint)]">
        Protected area. Set <code className="font-mono">ADMIN_PASSWORD</code> in
        your environment.
      </p>
    </GlassCard>
  );
}
