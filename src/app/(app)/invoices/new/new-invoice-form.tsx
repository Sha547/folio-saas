"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import {
  createInvoiceAction,
  type InvoiceActionState,
} from "@/lib/actions/invoices";

type Item = { description: string; quantity: string; unitPrice: string };

const blankItem: Item = { description: "", quantity: "1", unitPrice: "0" };

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function NewInvoiceForm({
  clients,
}: {
  clients: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState<InvoiceActionState, FormData>(
    createInvoiceAction,
    undefined,
  );
  const [items, setItems] = useState<Item[]>([blankItem]);
  const [taxRate, setTaxRate] = useState("0");

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (s, it) => s + Number(it.quantity || 0) * Number(it.unitPrice || 0),
      0,
    );
    const tax = subtotal * (Number(taxRate || 0) / 100);
    return { subtotal, tax, total: subtotal + tax };
  }, [items, taxRate]);

  const updateItem = (i: number, field: keyof Item, value: string) => {
    setItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)),
    );
  };

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Client *</label>
          <select
            name="clientId"
            required
            defaultValue=""
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          >
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Due date *</label>
          <input
            type="date"
            name="dueDate"
            required
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Line items</label>
          <button
            type="button"
            onClick={() => setItems((p) => [...p, { ...blankItem }])}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add item
          </button>
        </div>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-start">
              <input
                name="itemDescription"
                placeholder="Description"
                required
                value={it.description}
                onChange={(e) => updateItem(i, "description", e.target.value)}
                className="col-span-6 px-3 py-2 border rounded-md bg-transparent"
              />
              <input
                name="itemQuantity"
                type="number"
                min="0"
                step="0.01"
                placeholder="Qty"
                value={it.quantity}
                onChange={(e) => updateItem(i, "quantity", e.target.value)}
                className="col-span-2 px-3 py-2 border rounded-md bg-transparent"
              />
              <input
                name="itemPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Unit price"
                value={it.unitPrice}
                onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
                className="col-span-3 px-3 py-2 border rounded-md bg-transparent"
              />
              <button
                type="button"
                disabled={items.length === 1}
                onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
                className="col-span-1 text-gray-500 hover:text-red-600 disabled:opacity-30 px-2 py-2"
                aria-label="Remove item"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tax rate (%)</label>
          <input
            type="number"
            name="taxRate"
            min="0"
            max="100"
            step="0.01"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Payment terms, thank-you note, etc."
          className="w-full px-3 py-2 border rounded-md bg-transparent"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 space-y-1 text-sm">
        <Row label="Subtotal" value={currency.format(totals.subtotal)} />
        <Row label={`Tax (${taxRate}%)`} value={currency.format(totals.tax)} />
        <Row label="Total" value={currency.format(totals.total)} bold />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium"
        >
          {pending ? "Creating..." : "Create invoice"}
        </button>
        <Link
          href="/invoices"
          className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold text-base pt-1 border-t" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
