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
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            Money owed (or paid)
          </p>
          <h1 className="serif text-5xl">Invoices</h1>
        </div>
        <Link
          href="/invoices/new"
          className="bg-foreground text-background px-4 py-2 hover:bg-neutral-800 inline-flex items-center gap-2"
        >
          New invoice <span aria-hidden>→</span>
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="border border-dashed border-hairline px-6 py-20 text-center">
          <p className="serif text-2xl">No invoices yet.</p>
          <p className="text-muted mt-2">Send your first one.</p>
          <Link
            href="/invoices/new"
            className="mt-6 inline-block hover:underline underline-offset-4"
          >
            Create one →
          </Link>
        </div>
      ) : (
        <div className="border-t border-hairline">
          <div className="grid grid-cols-12 py-3 border-b border-hairline font-mono text-[10px] uppercase tracking-widest text-muted">
            <div className="col-span-2 px-2">Number</div>
            <div className="col-span-4 px-2">Client</div>
            <div className="col-span-2 px-2">Due</div>
            <div className="col-span-2 px-2 text-right">Amount</div>
            <div className="col-span-2 px-2 text-right">Status</div>
          </div>
          {invoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/invoices/${inv.id}`}
              className="grid grid-cols-12 items-baseline py-4 border-b border-hairline gap-2 hover:bg-foreground/[0.02]"
            >
              <div className="col-span-2 px-2 font-mono text-sm">{inv.number}</div>
              <div className="col-span-4 px-2">{inv.client.name}</div>
              <div className="col-span-2 px-2 text-sm text-muted font-mono">
                {inv.dueDate.toLocaleDateString()}
              </div>
              <div className="col-span-2 px-2 text-right font-mono tabular">
                {currency.format(inv.total)}
              </div>
              <div className="col-span-2 px-2 flex justify-end">
                <Status status={inv.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
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
