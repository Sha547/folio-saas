import Link from "next/link";
import { requireWorkspace } from "@/lib/session";
import { db } from "@/lib/db";
import { deleteExpenseAction } from "@/lib/actions/expenses";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function ExpensesPage() {
  const { organization } = await requireWorkspace();
  const expenses = await db.expense.findMany({
    where: { organizationId: organization.id },
    orderBy: { date: "desc" },
  });

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted mt-1 text-sm">
            <span className="font-mono tabular">{expenses.length}</span> entries
            ·{" "}
            <span className="font-mono tabular">{currency.format(total)}</span>{" "}
            total
          </p>
        </div>
        <Link
          href="/expenses/new"
          className="bg-accent hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-full font-medium transition shadow-md shadow-accent/20"
        >
          + New expense
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-4xl mb-3">📸</div>
          <h2 className="text-xl font-semibold tracking-tight">
            No expenses yet
          </h2>
          <p className="text-muted mt-1">
            Snap a receipt — Claude reads it for you.
          </p>
          <Link
            href="/expenses/new"
            className="mt-6 inline-block bg-accent hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-full font-medium transition"
          >
            Add an expense
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-border/40">
            {expenses.map((e) => (
              <li
                key={e.id}
                className="px-6 py-4 grid grid-cols-12 items-center gap-4"
              >
                <div className="col-span-2 hidden sm:block">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-lg">
                    {iconFor(e.category)}
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <p className="font-medium">{e.vendor}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {e.category ?? "Uncategorized"} ·{" "}
                    {e.date.toLocaleDateString()}
                  </p>
                </div>
                <span className="col-span-3 sm:col-span-3 text-sm font-mono tabular text-right sm:text-left">
                  {currency.format(e.amount)}
                </span>
                <div className="col-span-2 hidden sm:block">
                  {e.receiptKey ? (
                    <a
                      href={`/api/uploads/${e.receiptKey}`}
                      target="_blank"
                      rel="noopener"
                      className="text-xs text-accent font-medium hover:underline underline-offset-4"
                    >
                      View receipt
                    </a>
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </div>
                <div className="col-span-3 sm:col-span-1 text-right">
                  <form action={deleteExpenseAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <button
                      type="submit"
                      className="text-xs text-red-600 hover:underline underline-offset-4"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function iconFor(category: string | null) {
  const map: Record<string, string> = {
    Food: "🍴",
    Travel: "✈️",
    Office: "🏢",
    Software: "💻",
    Marketing: "📣",
    Other: "📌",
  };
  return map[category ?? ""] ?? "💸";
}
