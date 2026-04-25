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
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            Money out
          </p>
          <h1 className="serif text-5xl">Expenses</h1>
          <p className="mt-3 font-mono text-sm text-muted tabular">
            {expenses.length} entries · {currency.format(total)} total
          </p>
        </div>
        <Link
          href="/expenses/new"
          className="bg-foreground text-background px-4 py-2 hover:bg-neutral-800 inline-flex items-center gap-2"
        >
          New expense <span aria-hidden>→</span>
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="border border-dashed border-hairline px-6 py-20 text-center">
          <p className="serif text-2xl">Nothing tracked yet.</p>
          <p className="text-muted mt-2">
            Snap a receipt — Claude reads it for you.
          </p>
          <Link
            href="/expenses/new"
            className="mt-6 inline-block hover:underline underline-offset-4"
          >
            Add one →
          </Link>
        </div>
      ) : (
        <div className="border-t border-hairline">
          <div className="grid grid-cols-12 py-3 border-b border-hairline font-mono text-[10px] uppercase tracking-widest text-muted">
            <div className="col-span-2 px-2">Date</div>
            <div className="col-span-4 px-2">Vendor</div>
            <div className="col-span-2 px-2">Category</div>
            <div className="col-span-2 px-2 text-right">Amount</div>
            <div className="col-span-1 px-2 text-right">Receipt</div>
            <div className="col-span-1 px-2" />
          </div>
          {expenses.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-12 items-baseline py-4 border-b border-hairline gap-2"
            >
              <div className="col-span-2 px-2 font-mono text-sm text-muted">
                {e.date.toLocaleDateString()}
              </div>
              <div className="col-span-4 px-2">{e.vendor}</div>
              <div className="col-span-2 px-2 text-sm text-muted">
                {e.category ?? "—"}
              </div>
              <div className="col-span-2 px-2 text-right font-mono tabular">
                {currency.format(e.amount)}
              </div>
              <div className="col-span-1 px-2 text-right">
                {e.receiptKey ? (
                  <a
                    href={`/api/uploads/${e.receiptKey}`}
                    target="_blank"
                    rel="noopener"
                    className="font-mono text-[10px] uppercase tracking-widest hover:underline underline-offset-4"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </div>
              <div className="col-span-1 px-2 text-right">
                <form action={deleteExpenseAction}>
                  <input type="hidden" name="id" value={e.id} />
                  <button
                    type="submit"
                    className="font-mono text-[10px] uppercase tracking-widest text-muted hover:text-red-700"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
