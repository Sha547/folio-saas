"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createClientAction,
  type ClientActionState,
} from "@/lib/actions/clients";

export default function NewClientForm() {
  const [state, formAction, pending] = useActionState<ClientActionState, FormData>(
    createClientAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-6">
      <Field label="Name" name="name" required />
      <Field label="Email" name="email" type="email" />
      <Field label="Address" name="address" textarea />

      {state?.error && (
        <p className="text-sm text-red-700 font-mono">— {state.error}</p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-foreground text-background px-5 py-3 hover:bg-neutral-800 disabled:opacity-40 inline-flex items-center gap-2"
        >
          {pending ? "Saving…" : (
            <>
              Save client <span aria-hidden>→</span>
            </>
          )}
        </button>
        <Link
          href="/clients"
          className="text-sm hover:underline underline-offset-4"
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
  const cls =
    "mt-2 w-full px-0 py-2 bg-transparent border-b border-foreground focus:outline-none focus:border-b-2";
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
        {label}
        {required && " *"}
      </span>
      {textarea ? (
        <textarea name={name} rows={2} className={cls} />
      ) : (
        <input name={name} type={type} required={required} className={cls} />
      )}
    </label>
  );
}
