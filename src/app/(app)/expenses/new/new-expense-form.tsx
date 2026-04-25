"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createExpenseAction,
  type ExpenseActionState,
} from "@/lib/actions/expenses";

const categories = ["Food", "Travel", "Office", "Software", "Marketing", "Other"];

const fieldCls =
  "mt-2 w-full px-0 py-2 bg-transparent border-b border-foreground focus:outline-none focus:border-b-2";

export default function NewExpenseForm({ aiEnabled }: { aiEnabled: boolean }) {
  const [state, formAction, pending] = useActionState<ExpenseActionState, FormData>(
    createExpenseAction,
    undefined,
  );
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  async function handleReceiptChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !aiEnabled) return;
    if (!file.type.startsWith("image/")) return;

    setParsing(true);
    setParseError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/expenses/parse-receipt", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setParseError(json.error ?? "Failed to parse receipt");
      } else if (json.data) {
        if (json.data.vendor) setVendor(json.data.vendor);
        if (json.data.amount != null) setAmount(String(json.data.amount));
        if (json.data.date) setDate(json.data.date);
        if (json.data.category) setCategory(json.data.category);
      }
    } catch {
      setParseError("Network error while parsing receipt");
    } finally {
      setParsing(false);
    }
  }

  return (
    <form action={formAction} className="space-y-8">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Receipt {aiEnabled && <em className="not-italic text-foreground">(AI will fill the rest)</em>}
        </span>
        <input
          type="file"
          name="receipt"
          accept="image/*,application/pdf"
          onChange={handleReceiptChange}
          className="mt-3 block w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:border file:border-foreground file:bg-transparent file:text-foreground file:hover:bg-foreground file:hover:text-background"
        />
        {parsing && (
          <p className="text-xs font-mono mt-2">— Reading receipt…</p>
        )}
        {parseError && (
          <p className="text-xs font-mono text-red-700 mt-2">— {parseError}</p>
        )}
      </div>

      <div className="border-t border-hairline pt-8 grid sm:grid-cols-2 gap-8">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Vendor *
          </span>
          <input
            name="vendor"
            required
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className={fieldCls}
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Amount *
          </span>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${fieldCls} font-mono tabular`}
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Date *
          </span>
          <input
            type="date"
            name="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={fieldCls}
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Category
          </span>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={fieldCls}
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Notes
        </span>
        <textarea name="notes" rows={2} className={fieldCls} />
      </label>

      {state?.error && (
        <p className="text-sm text-red-700 font-mono">— {state.error}</p>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-hairline">
        <button
          type="submit"
          disabled={pending}
          className="bg-foreground text-background px-5 py-3 hover:bg-neutral-800 disabled:opacity-40 inline-flex items-center gap-2"
        >
          {pending ? "Saving…" : (
            <>
              Save expense <span aria-hidden>→</span>
            </>
          )}
        </button>
        <Link
          href="/expenses"
          className="text-sm hover:underline underline-offset-4"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
