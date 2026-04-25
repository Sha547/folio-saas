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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">
            {expenses.length} expenses • {currency.format(total)} total
          </p>
        </div>
        <Link
          href="/expenses/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + New expense
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
        {expenses.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No expenses yet.{" "}
            <Link href="/expenses/new" className="text-blue-600 hover:underline">
              Add one
            </Link>
            .
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-left">
              <tr>
                <Th>Date</Th>
                <Th>Vendor</Th>
                <Th>Category</Th>
                <Th>Amount</Th>
                <Th>Receipt</Th>
                <Th aria-label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Td>{e.date.toLocaleDateString()}</Td>
                  <Td className="font-medium">{e.vendor}</Td>
                  <Td className="text-gray-500">{e.category ?? "—"}</Td>
                  <Td>{currency.format(e.amount)}</Td>
                  <Td>
                    {e.receiptKey ? (
                      <a
                        href={`/api/uploads/${e.receiptKey}`}
                        target="_blank"
                        rel="noopener"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </Td>
                  <Td className="text-right">
                    <form action={deleteExpenseAction}>
                      <input type="hidden" name="id" value={e.id} />
                      <button
                        type="submit"
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Th({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className="px-6 py-3 text-xs uppercase tracking-wide text-gray-500" {...props}>
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-6 py-3 ${className}`}>{children}</td>;
}
