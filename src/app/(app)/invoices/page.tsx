import Link from "next/link";
import { requireWorkspace } from "@/lib/session";
import { db } from "@/lib/db";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function InvoicesPage() {
  const { organization } = await requireWorkspace();
  const invoices = await db.invoice.findMany({
    where: { organizationId: organization.id },
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted mt-1">All invoices in this workspace.</p>
        </div>
        <Link
          href="/invoices/new"
          className="bg-accent hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-full font-medium transition shadow-md shadow-accent/20"
        >
          + New invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-4xl mb-3">📄</div>
          <h2 className="text-xl font-semibold tracking-tight">
            No invoices yet
          </h2>
          <p className="text-muted mt-1">
            Send your first one to start tracking payments.
          </p>
          <Link
            href="/invoices/new"
            className="mt-6 inline-block bg-accent hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-full font-medium transition"
          >
            Create one
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-border/40">
            {invoices.map((inv) => (
              <li key={inv.id}>
                <Link
                  href={`/invoices/${inv.id}`}
                  className="px-6 py-4 grid grid-cols-12 items-center gap-4 hover:bg-foreground/[0.02] transition"
                >
                  <span className="col-span-3 sm:col-span-2 font-mono text-sm font-medium">
                    {inv.number}
                  </span>
                  <span className="col-span-9 sm:col-span-4 text-sm">
                    {inv.client.name}
                  </span>
                  <span className="hidden sm:block sm:col-span-2 text-xs text-muted font-mono">
                    Due {inv.dueDate.toLocaleDateString()}
                  </span>
                  <span className="col-span-6 sm:col-span-2 text-sm font-mono tabular text-right sm:text-left">
                    {currency.format(inv.total)}
                  </span>
                  <div className="col-span-6 sm:col-span-2 flex justify-end">
                    <StatusPill status={inv.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
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
