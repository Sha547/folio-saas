"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createExpenseAction,
  type ExpenseActionState,
} from "@/lib/actions/expenses";

const categories = ["Food", "Travel", "Office", "Software", "Marketing", "Other"];

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
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Receipt (optional)</label>
        <input
          type="file"
          name="receipt"
          accept="image/*,application/pdf"
          onChange={handleReceiptChange}
          className="block w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {parsing && (
          <p className="text-xs text-blue-600 mt-1">Reading receipt with AI…</p>
        )}
        {parseError && <p className="text-xs text-red-600 mt-1">{parseError}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Vendor *</label>
          <input
            name="vendor"
            required
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount *</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input
            type="date"
            name="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          rows={2}
          className="w-full px-3 py-2 border rounded-md bg-transparent"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium"
        >
          {pending ? "Saving..." : "Save expense"}
        </button>
        <Link
          href="/expenses"
          className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
