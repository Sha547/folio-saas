"use client";

import { useActionState } from "react";
import { registerAction, type ActionState } from "@/lib/actions/auth";

const inputCls =
  "w-full px-4 py-2.5 bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    registerAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Your name" name="name" autoComplete="name" required />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        hint="At least 6 characters."
      />

      {state?.error && (
        <p className="text-sm text-red-600 px-3 py-2 rounded-lg bg-red-50">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-accent hover:bg-[var(--accent-hover)] text-white py-3 rounded-xl font-medium disabled:opacity-50 transition mt-2"
      >
        {pending ? "Creating workspace…" : "Create workspace"}
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
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={`${inputCls} mt-1.5`}
      />
      {hint && <span className="block mt-1.5 text-xs text-muted">{hint}</span>}
    </label>
  );
}
