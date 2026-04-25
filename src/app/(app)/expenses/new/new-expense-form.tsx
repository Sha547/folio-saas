"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createExpenseAction,
  type ExpenseActionState,
} from "@/lib/actions/expenses";

const categories = ["Food", "Travel", "Office", "Software", "Marketing", "Other"];

const inputCls =
  "w-full px-4 py-2.5 bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition";

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
    <form action={formAction} className="space-y-5">
      <div>
        <span className="text-sm font-medium flex items-center gap-2">
          Receipt
          {aiEnabled && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
            >
              AI
            </span>
          )}
        </span>
        <input
          type="file"
          name="receipt"
          accept="image/*,application/pdf"
          onChange={handleReceiptChange}
          className="mt-2 block w-full text-sm file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-accent/10 file:text-accent hover:file:bg-accent/20 file:font-medium file:cursor-pointer cursor-pointer"
        />
        {parsing && (
          <p className="mt-2 text-sm text-accent flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            Reading receipt with AI…
          </p>
        )}
        {parseError && (
          <p className="mt-2 text-sm text-red-600">{parseError}</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Vendor"
          name="vendor"
          required
          value={vendor}
          onChange={setVendor}
        />
        <Field
          label="Amount"
          name="amount"
          type="number"
          required
          value={amount}
          onChange={setAmount}
          mono
        />
        <Field
          label="Date"
          name="date"
          type="date"
          required
          value={date}
          onChange={setDate}
        />
        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputCls} mt-1.5`}
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
        <span className="text-sm font-medium">Notes</span>
        <textarea name="notes" rows={2} className={`${inputCls} mt-1.5`} />
      </label>

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
          {pending ? "Saving…" : "Save expense"}
        </button>
        <Link
          href="/expenses"
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
  required,
  value,
  onChange,
  mono,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={type === "number" ? "0.01" : undefined}
        min={type === "number" ? "0" : undefined}
        className={`${inputCls} mt-1.5 ${mono ? "font-mono tabular" : ""}`}
      />
    </label>
  );
}
