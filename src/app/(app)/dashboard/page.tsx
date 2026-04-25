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

  const [invoiceCount, outstandingAgg, paidAgg, recentInvoices, expensesMonthAgg, clientCount] =
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
      db.client.count({ where: { organizationId: organization.id } }),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hi {user.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-muted mt-1">
          Here&apos;s what&apos;s happening in {organization.name}.
        </p>
      </div>

      {/* Bento stats */}
      <section className="bento auto-rows-[140px]">
        {/* Big paid card */}
        <div
          className="col-span-12 md:col-span-6 row-span-2 card p-6 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0066ff 0%, #0099ff 100%)" }}
        >
          <div className="relative z-10">
            <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
              Paid lifetime
            </p>
            <p className="text-5xl font-bold tracking-tight mt-3 tabular">
              {currency.format(paidAgg._sum.total ?? 0)}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              From {invoiceCount} invoice{invoiceCount === 1 ? "" : "s"}
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        </div>

        {/* Outstanding */}
        <div className="col-span-6 md:col-span-3 card p-5 flex flex-col justify-between">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">
            Outstanding
          </p>
          <p className="text-2xl font-bold tracking-tight tabular">
            {currency.format(outstandingAgg._sum.total ?? 0)}
          </p>
        </div>

        {/* Clients */}
        <div className="col-span-6 md:col-span-3 card p-5 flex flex-col justify-between">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">
            Clients
          </p>
          <p className="text-2xl font-bold tracking-tight tabular">{clientCount}</p>
        </div>

        {/* Expenses month */}
        <div className="col-span-12 md:col-span-6 card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider">
              Spent this month
            </p>
            <p className="text-2xl font-bold tracking-tight tabular mt-1">
              {currency.format(expensesMonthAgg._sum.amount ?? 0)}
            </p>
          </div>
          <Link
            href="/expenses/new"
            className="text-sm bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-full font-medium transition"
          >
            Add expense
          </Link>
        </div>
      </section>

      {/* Recent invoices */}
      <section className="card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-border/40">
          <h2 className="font-semibold tracking-tight">Recent invoices</h2>
          <Link
            href="/invoices/new"
            className="text-sm text-accent font-medium hover:underline underline-offset-4"
          >
            New invoice →
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <Empty
            label="No invoices yet"
            cta="Create your first one"
            href="/invoices/new"
          />
        ) : (
          <ul className="divide-y divide-border/40">
            {recentInvoices.map((inv) => (
              <li key={inv.id}>
                <Link
                  href={`/invoices/${inv.id}`}
                  className="px-6 py-4 grid grid-cols-12 items-center gap-4 hover:bg-foreground/[0.02] transition"
                >
                  <span className="col-span-3 font-mono text-sm font-medium">
                    {inv.number}
                  </span>
                  <span className="col-span-4 text-sm">{inv.client.name}</span>
                  <span className="col-span-3 text-sm font-mono tabular text-right">
                    {currency.format(inv.total)}
                  </span>
                  <div className="col-span-2 flex justify-end">
                    <StatusPill status={inv.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
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
    <div className="px-6 py-16 text-center">
      <p className="text-muted">{label}.</p>
      <Link
        href={href}
        className="mt-3 inline-block text-accent font-medium hover:underline underline-offset-4"
      >
        {cta} →
      </Link>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-neutral-100 text-neutral-700",
    sent: "bg-amber-100 text-amber-700",
    paid: "bg-emerald-100 text-emerald-700",
    overdue: "bg-red-100 text-red-700",
  };
  const dots: Record<string, string> = {
    draft: "bg-neutral-500",
    sent: "bg-amber-500",
    paid: "bg-emerald-600",
    overdue: "bg-red-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
        styles[status] ?? styles.draft
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? dots.draft}`} />
      {status}
    </span>
  );
}
