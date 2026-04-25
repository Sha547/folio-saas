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
        take: 6,
        include: { client: true },
      }),
      db.expense.aggregate({
        where: { organizationId: organization.id, date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
    ]);

  return (
    <div className="space-y-16">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="serif text-5xl md:text-6xl leading-tight">
          Hello, {user.name?.split(" ")[0] ?? "there"}.
        </h1>
      </header>

      <section className="border-y border-hairline">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          <Stat label="Invoices" value={String(invoiceCount)} />
          <Stat
            label="Outstanding"
            value={currency.format(outstandingAgg._sum.total ?? 0)}
          />
          <Stat
            label="Paid"
            value={currency.format(paidAgg._sum.total ?? 0)}
          />
          <Stat
            label="Spent this month"
            value={currency.format(expensesMonthAgg._sum.amount ?? 0)}
          />
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="serif text-3xl">Recent invoices</h2>
          <Link
            href="/invoices/new"
            className="text-sm hover:underline underline-offset-4"
          >
            New invoice →
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <Empty
            label="Nothing invoiced yet"
            cta="Create the first one"
            href="/invoices/new"
          />
        ) : (
          <ul className="border-t border-hairline">
            {recentInvoices.map((inv) => (
              <li
                key={inv.id}
                className="border-b border-hairline grid grid-cols-12 items-baseline py-4 gap-4"
              >
                <Link
                  href={`/invoices/${inv.id}`}
                  className="col-span-3 font-mono text-sm hover:underline underline-offset-4"
                >
                  {inv.number}
                </Link>
                <span className="col-span-5 text-sm">{inv.client.name}</span>
                <span className="col-span-2 font-mono tabular text-sm text-right">
                  {currency.format(inv.total)}
                </span>
                <div className="col-span-2 flex justify-end">
                  <Status status={inv.status} />
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
    <div className="border-r last:border-r-0 border-hairline px-6 py-8">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </p>
      <p className="serif text-4xl mt-3 tabular">{value}</p>
    </div>
  );
}

function Empty({
  label,
  cta,
  href,
}: {
  label: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="border border-dashed border-hairline px-6 py-16 text-center">
      <p className="text-muted">{label}.</p>
      <Link
        href={href}
        className="mt-4 inline-block hover:underline underline-offset-4"
      >
        {cta} →
      </Link>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const tone: Record<string, string> = {
    draft: "bg-neutral-400",
    sent: "bg-amber-500",
    paid: "bg-green-600",
    overdue: "bg-red-600",
  };
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${tone[status] ?? "bg-neutral-400"}`} />
      {status}
    </span>
  );
}
