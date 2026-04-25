import { requireWorkspace } from "@/lib/session";
import NewExpenseForm from "./new-expense-form";

export default async function NewExpensePage() {
  await requireWorkspace();
  const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div className="max-w-xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
        New
      </p>
      <h1 className="serif text-5xl">Log an expense.</h1>
      <p className="mt-3 text-muted">
        {aiEnabled
          ? "Drop in a receipt — Claude reads it. Or just type the details."
          : "Type it out. Add ANTHROPIC_API_KEY to .env to read receipts with AI."}
      </p>
      <div className="mt-12">
        <NewExpenseForm aiEnabled={aiEnabled} />
      </div>
    </div>
  );
}
