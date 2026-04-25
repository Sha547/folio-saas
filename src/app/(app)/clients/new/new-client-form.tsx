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
    <form action={formAction} className="space-y-4">
      <Field label="Name" name="name" required />
      <Field label="Email" name="email" type="email" />
      <Field label="Address" name="address" textarea />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium"
        >
          {pending ? "Saving..." : "Save client"}
        </button>
        <Link
          href="/clients"
          className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
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
    "w-full px-3 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500";
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {textarea ? (
        <textarea id={name} name={name} rows={3} className={cls} />
      ) : (
        <input id={name} name={name} type={type} required={required} className={cls} />
      )}
    </div>
  );
}
