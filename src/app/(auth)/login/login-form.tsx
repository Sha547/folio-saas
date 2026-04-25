"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/actions/auth";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      {state?.error && (
        <p className="text-sm text-red-700 font-mono">— {state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-foreground text-background py-3 hover:bg-neutral-800 disabled:opacity-40 inline-flex items-center justify-center gap-2"
      >
        {pending ? "Signing in…" : (
          <>
            Sign in <span aria-hidden>→</span>
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
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
    </label>
  );
}
