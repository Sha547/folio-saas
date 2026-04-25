"use client";

import { useActionState } from "react";
import { registerAction, type ActionState } from "@/lib/actions/auth";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    registerAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Your name" name="name" autoComplete="name" required />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        hint="At least six characters."
      />

      {state?.error && (
        <p className="text-sm text-red-700 font-mono">— {state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-foreground text-background py-3 hover:bg-neutral-800 disabled:opacity-40 inline-flex items-center justify-center gap-2"
      >
        {pending ? "Creating workspace…" : (
          <>
            Create my workspace <span aria-hidden>→</span>
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full px-0 py-2 bg-transparent border-b border-foreground focus:outline-none focus:border-b-2"
      />
      {hint && <span className="block mt-1 text-xs text-muted">{hint}</span>}
    </label>
  );
}
