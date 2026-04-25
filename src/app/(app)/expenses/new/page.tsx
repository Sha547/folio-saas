import Link from "next/link";
import { requireWorkspace } from "@/lib/session";
import NewExpenseForm from "./new-expense-form";

export default async function NewExpensePage() {
  await requireWorkspace();
  const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/expenses"
        className="text-sm text-muted hover:text-foreground inline-flex items-center gap-1 mb-4"
      >
        ← Expenses
      </Link>
      <div className="card p-8">
        <h1 className="text-2xl font-bold tracking-tight">New expense</h1>
        <p className="text-muted mt-1 text-sm">
          {aiEnabled
            ? "Drop in a receipt and AI fills in the details."
            : "Type it out. Add ANTHROPIC_API_KEY to .env to enable AI receipt parsing."}
        </p>
        <div className="mt-8">
          <NewExpenseForm aiEnabled={aiEnabled} />
        </div>
      </div>
    </div>
  );
}
