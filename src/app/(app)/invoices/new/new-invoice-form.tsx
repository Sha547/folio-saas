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

const fieldCls =
  "mt-2 w-full px-0 py-2 bg-transparent border-b border-foreground focus:outline-none focus:border-b-2";

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
    <form action={formAction} className="space-y-12">
      <div className="grid sm:grid-cols-2 gap-8">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Client *
          </span>
          <select
            name="clientId"
            required
            defaultValue=""
            className={fieldCls}
          >
            <option value="" disabled>
              Pick someone
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Due date *
          </span>
          <input type="date" name="dueDate" required className={fieldCls} />
        </label>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Line items
          </span>
          <button
            type="button"
            onClick={() => setItems((p) => [...p, { ...blankItem }])}
            className="text-sm hover:underline underline-offset-4"
          >
            + Add line
          </button>
        </div>
        <div className="border-t border-hairline">
          {items.map((it, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-3 py-3 border-b border-hairline items-baseline"
            >
              <input
                name="itemDescription"
                placeholder="Description"
                required
                value={it.description}
                onChange={(e) => updateItem(i, "description", e.target.value)}
                className="col-span-6 px-0 py-1 bg-transparent border-b border-transparent focus:border-foreground focus:outline-none"
              />
              <input
                name="itemQuantity"
                type="number"
                min="0"
                step="0.01"
                placeholder="Qty"
                value={it.quantity}
                onChange={(e) => updateItem(i, "quantity", e.target.value)}
                className="col-span-2 px-0 py-1 bg-transparent border-b border-transparent focus:border-foreground focus:outline-none font-mono tabular text-right"
              />
              <input
                name="itemPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Unit"
                value={it.unitPrice}
                onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
                className="col-span-3 px-0 py-1 bg-transparent border-b border-transparent focus:border-foreground focus:outline-none font-mono tabular text-right"
              />
              <button
                type="button"
                disabled={items.length === 1}
                onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
                className="col-span-1 text-muted hover:text-red-700 disabled:opacity-20 text-right"
                aria-label="Remove item"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Tax rate (%)
          </span>
          <input
            type="number"
            name="taxRate"
            min="0"
            max="100"
            step="0.01"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className={`${fieldCls} font-mono tabular`}
          />
        </label>
      </div>

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Notes
        </span>
        <textarea
          name="notes"
          rows={2}
          placeholder="Payment terms, thank-you note…"
          className={fieldCls}
        />
      </label>

      <div className="ml-auto max-w-xs space-y-2 font-mono tabular text-sm">
        <Row label="Subtotal" value={currency.format(totals.subtotal)} />
        <Row label={`Tax (${taxRate}%)`} value={currency.format(totals.tax)} />
        <div className="border-t border-foreground pt-2 mt-2">
          <Row
            label="Total"
            value={currency.format(totals.total)}
            bold
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-700 font-mono">— {state.error}</p>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-hairline">
        <button
          type="submit"
          disabled={pending}
          className="bg-foreground text-background px-5 py-3 hover:bg-neutral-800 disabled:opacity-40 inline-flex items-center gap-2"
        >
          {pending ? "Creating…" : (
            <>
              Create invoice <span aria-hidden>→</span>
            </>
          )}
        </button>
        <Link
          href="/invoices"
          className="text-sm hover:underline underline-offset-4"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base" : "text-muted"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
