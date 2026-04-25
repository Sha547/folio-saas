"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createClientAction,
  type ClientActionState,
} from "@/lib/actions/clients";

const inputCls =
  "w-full px-4 py-2.5 bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition";

export default function NewClientForm() {
  const [state, formAction, pending] = useActionState<ClientActionState, FormData>(
    createClientAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Name" name="name" required />
      <Field label="Email" name="email" type="email" />
      <Field label="Address" name="address" textarea />

      {state?.error && (
        <p className="text-sm text-red-600 px-3 py-2 rounded-lg bg-red-50">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-xl font-medium disabled:opacity-50 transition"
        >
          {pending ? "Saving…" : "Save client"}
        </button>
        <Link
          href="/clients"
          className="text-sm text-muted hover:text-foreground px-4 py-2 rounded-full hover:bg-foreground/5 transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {textarea ? (
        <textarea name={name} rows={2} className={`${inputCls} mt-1.5`} />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className={`${inputCls} mt-1.5`}
        />
      )}
    </label>
  );
}
