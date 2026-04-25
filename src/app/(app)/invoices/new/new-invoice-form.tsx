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

const inputCls =
  "w-full px-4 py-2.5 bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition";
const itemInputCls =
  "px-3 py-2 bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm";

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
        <label className="block">
          <span className="text-sm font-medium">
            Client <span className="text-accent">*</span>
          </span>
          <select name="clientId" required defaultValue="" className={`${inputCls} mt-1.5`}>
            <option value="" disabled>
              Pick a client
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">
            Due date <span className="text-accent">*</span>
          </span>
          <input
            type="date"
            name="dueDate"
            required
            className={`${inputCls} mt-1.5`}
          />
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Line items</span>
          <button
            type="button"
            onClick={() => setItems((p) => [...p, { ...blankItem }])}
            className="text-sm text-accent font-medium hover:underline underline-offset-4"
          >
            + Add line
          </button>
        </div>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input
                name="itemDescription"
                placeholder="Description"
                required
                value={it.description}
                onChange={(e) => updateItem(i, "description", e.target.value)}
                className={`${itemInputCls} col-span-6`}
              />
              <input
                name="itemQuantity"
                type="number"
                min="0"
                step="0.01"
                placeholder="Qty"
                value={it.quantity}
                onChange={(e) => updateItem(i, "quantity", e.target.value)}
                className={`${itemInputCls} col-span-2 font-mono tabular text-right`}
              />
              <input
                name="itemPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Unit price"
                value={it.unitPrice}
                onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
                className={`${itemInputCls} col-span-3 font-mono tabular text-right`}
              />
              <button
                type="button"
                disabled={items.length === 1}
                onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
                className="col-span-1 w-8 h-8 mx-auto rounded-full hover:bg-foreground/5 text-muted hover:text-red-600 disabled:opacity-20 disabled:hover:bg-transparent transition"
                aria-label="Remove item"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Tax rate (%)</span>
          <input
            type="number"
            name="taxRate"
            min="0"
            max="100"
            step="0.01"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className={`${inputCls} mt-1.5 font-mono tabular`}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Notes</span>
        <textarea
          name="notes"
          rows={2}
          placeholder="Payment terms, thank-you note…"
          className={`${inputCls} mt-1.5`}
        />
      </label>

      <div className="card p-4 bg-foreground/[0.02] space-y-1.5">
        <Row label="Subtotal" value={currency.format(totals.subtotal)} />
        <Row label={`Tax (${taxRate}%)`} value={currency.format(totals.tax)} />
        <Row label="Total" value={currency.format(totals.total)} bold />
      </div>

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
          {pending ? "Creating…" : "Create invoice"}
        </button>
        <Link
          href="/invoices"
          className="text-sm text-muted hover:text-foreground px-4 py-2 rounded-full hover:bg-foreground/5 transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={`flex justify-between text-sm ${
        bold ? "font-semibold text-base pt-2 border-t border-border/40" : "text-muted"
      }`}
    >
      <span>{label}</span>
      <span className="font-mono tabular">{value}</span>
    </div>
  );
}
