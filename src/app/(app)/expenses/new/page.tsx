import { requireWorkspace } from "@/lib/session";
import NewExpenseForm from "./new-expense-form";

export default async function NewExpensePage() {
  await requireWorkspace();
  const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New expense</h1>
        <p className="text-sm text-gray-500 mt-1">
          {aiEnabled
            ? "Upload a receipt and we'll fill in the details automatically."
            : "Record a business expense. (Set ANTHROPIC_API_KEY in .env to enable AI receipt parsing.)"}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <NewExpenseForm aiEnabled={aiEnabled} />
      </div>
    </div>
  );
}
