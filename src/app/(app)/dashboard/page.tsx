import Link from "next/link";
import { requireWorkspace } from "@/lib/session";
import { db } from "@/lib/db";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function DashboardPage() {
  const { user, organization } = await requireWorkspace();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [invoiceCount, outstandingAgg, paidAgg, recentInvoices, expensesMonthAgg] =
    await Promise.all([
      db.invoice.count({ where: { organizationId: organization.id } }),
      db.invoice.aggregate({
        where: {
          organizationId: organization.id,
          status: { in: ["draft", "sent", "overdue"] },
        },
        _sum: { total: true },
      }),
      db.invoice.aggregate({
        where: { organizationId: organization.id, status: "paid" },
        _sum: { total: true },
      }),
      db.invoice.findMany({
        where: { organizationId: organization.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { client: true },
      }),
      db.expense.aggregate({
        where: { organizationId: organization.id, date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back, {user.name ?? user.email}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s a snapshot of your business.
        </p>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total invoices" value={String(invoiceCount)} />
        <Stat
          label="Outstanding"
          value={currency.format(outstandingAgg._sum.total ?? 0)}
        />
        <Stat
          label="Paid (lifetime)"
          value={currency.format(paidAgg._sum.total ?? 0)}
        />
        <Stat
          label="Expenses (this month)"
          value={currency.format(expensesMonthAgg._sum.amount ?? 0)}
        />
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-xl shadow">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Recent invoices</h2>
          <Link
            href="/invoices/new"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            New invoice →
          </Link>
        </div>
        {recentInvoices.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <p>No invoices yet.</p>
            <Link
              href="/invoices/new"
              className="mt-3 inline-block text-blue-600 font-medium hover:underline"
            >
              Create your first invoice
            </Link>
          </div>
        ) : (
          <ul className="divide-y">
            {recentInvoices.map((inv) => (
              <li key={inv.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="font-medium hover:underline"
                  >
                    {inv.number}
                  </Link>
                  <p className="text-xs text-gray-500">{inv.client.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{currency.format(inv.total)}</p>
                  <StatusBadge status={inv.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    sent: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
        colors[status] ?? colors.draft
      }`}
    >
      {status}
    </span>
  );
}
